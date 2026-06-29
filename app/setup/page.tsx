'use client';

import { useEffect, useMemo, useState } from 'react';

type PropertyType = 'str' | 'hotel';
type RoomSetupMode = 'range' | 'upload';

export default function SetupPage() {
  const [step, setStep] = useState(1);

  const [propertyType, setPropertyType] = useState<PropertyType>('str');
  const [propertyName, setPropertyName] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0B102F');
  const [accentColor, setAccentColor] = useState('#B88A44'); 

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [strPropertyCount, setStrPropertyCount] = useState('1');
  const [strQrMode, setStrQrMode] = useState<'shared' | 'per_property'>('per_property');

  const [roomSetupMode, setRoomSetupMode] = useState<RoomSetupMode>('range');
  const [startRoom, setStartRoom] = useState('101');
  const [endRoom, setEndRoom] = useState('150');
  const [excludedRooms, setExcludedRooms] = useState('');
  const [uploadedRooms, setUploadedRooms] = useState('');
  const [additionalRooms, setAdditionalRooms] = useState('');

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePayroll, setAgreePayroll] = useState(false);

  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [launchMode, setLaunchMode] = useState<'pilot' | 'active'>('pilot');

  const [stripeConnected, setStripeConnected] = useState(false);

  const [setupError, setSetupError] = useState('');

  useEffect(() => {
    async function handleStripeReturn() {
      const params = new URLSearchParams(window.location.search);

      const returnedPropertyId = params.get('propertyId');
      if (returnedPropertyId) {
        setPropertyId(returnedPropertyId);
      }
      const stripeStatus = params.get('stripe');

      if (!returnedPropertyId || stripeStatus !== 'return') return;

      const savedState = sessionStorage.getItem('roomflowSetupState');

      if (savedState) {
        const parsed = JSON.parse(savedState);

        setPropertyType(parsed.propertyType || 'str');
        setPropertyName(parsed.propertyName || '');
        setCity(parsed.city || '');
        setStateName(parsed.stateName || '');
        setPrimaryColor(parsed.primaryColor || '#0B102F');
        setAccentColor(parsed.accentColor || '#B88A44');
        setRoomSetupMode(parsed.roomSetupMode || 'range');
        setStartRoom(parsed.startRoom || '101');
        setEndRoom(parsed.endRoom || '150');
        setExcludedRooms(parsed.excludedRooms || '');
        setUploadedRooms(parsed.uploadedRooms || '');
        setAdditionalRooms(parsed.additionalRooms || '');
        setLaunchMode(parsed.launchMode || 'pilot');
      }

      try {
        const propertyResponse = await fetch(
          `/api/setup/get-draft-property/${returnedPropertyId}`
        );

        const propertyData = await propertyResponse.json();

        if (!propertyResponse.ok) {
          setSetupError(propertyData.error || 'Unable to reload property.');
          return;
        }

        const property = propertyData.property;

        setPropertyType(property.property_type || 'str');
        setPropertyName(property.name || '');
        setCity(property.city || '');
        setStateName(property.state || '');
        setPrimaryColor(property.primary_color || '#0B102F');
        setAccentColor(property.accent_color || '#B88A44');
        setLaunchMode(property.launch_mode || 'pilot');
        setAgreeTerms(Boolean(property.terms_accepted));
        setAgreePayroll(Boolean(property.pilot_agreement_accepted || property.privacy_accepted));

        const stripeResponse = await fetch(
          `/api/stripe/check-account/${returnedPropertyId}`,
          { method: 'POST' }
        );

        const stripeData = await stripeResponse.json();

        if (!stripeResponse.ok) {
          setSetupError(stripeData.error || 'Unable to verify Stripe.');
          return;
        }

        setStripeConnected(stripeData.complete);
        setStep(8);

        if (!stripeData.complete) {
          setSetupError(
            'Stripe onboarding was started, but it is not fully complete yet.'
          );
        }
      } catch (error) {
        console.error(error);
        setSetupError('Unable to complete Stripe return.');
      }
    }

    handleStripeReturn();
  }, []);

  const isHotel = propertyType === 'hotel';
  const isSTR = propertyType === 'str';

  const rooms = useMemo(() => {
  if (isSTR) {
    const count = Number(strPropertyCount) || 1;

    if (strQrMode === 'shared') {
      return ['Main Property'];
    }

    return Array.from({ length: count }, (_, index) => `STR Property ${index + 1}`);
  }

  let baseRooms: string[] = [];

  if (roomSetupMode === 'range') {
    const start = Number(startRoom);
    const end = Number(endRoom);

    if (start && end && end >= start) {
      const exclusions = excludedRooms
        .split(',')
        .map((room) => room.trim())
        .filter(Boolean);

      for (let room = start; room <= end; room++) {
        const roomString = String(room);
        if (!exclusions.includes(roomString)) {
          baseRooms.push(roomString);
        }
      }
    }
  }

  if (roomSetupMode === 'upload') {
    baseRooms = uploadedRooms
      .split(/\n|,/)
      .map((room) => room.trim())
      .filter(Boolean);
  }

  const addOns = additionalRooms
    .split(/\n|,/)
    .map((room) => room.trim())
    .filter(Boolean);

  function validateStep(currentStep: number) {
    setSetupError('');

    if (currentStep === 1 && !propertyType) {
      setSetupError('Please select a property type.');
      return false;
    }

    if (currentStep === 2) {
      if (!propertyName || !city || !stateName) {
        setSetupError('Please complete the property name, city, and state.');
        return false;
      }
    }

    if (currentStep === 6) {
      if (!agreeTerms || !agreePayroll) {
        setSetupError('Please accept the agreements before continuing.');
        return false;
      }
    }

    if (currentStep === 7) {
      if (!stripeConnected) {
        setSetupError('Please connect Stripe before continuing.');
        return false;
      }
    }

    return true;
  }

  return Array.from(new Set([...baseRooms, ...addOns]));
}, [
  isSTR,
  strPropertyCount,
  strQrMode,
  roomSetupMode,
  startRoom,
  endRoom,
  excludedRooms,
  uploadedRooms,
  additionalRooms
]);

  const roomCount = rooms.length;

  const monthlyPrice = useMemo(() => {
    if (isSTR) {
      const count = Number(strPropertyCount) || 1;

      if (count <= 1) return 5;
      if (count <= 5) return 15;
      if (count <= 10) return 29;
      if (count <= 25) return 79;
      if (count <= 50) return 199;
      if (count <= 75) return 399;
      if (count <= 100) return 599;

      return null;
    }

    if (roomCount <= 50) return 25;
    if (roomCount <= 100) return 50;
    if (roomCount <= 150) return 75;
    if (roomCount <= 250) return 125;
    if (roomCount <= 400) return 200;

    return null;
  }, [isSTR, roomCount, strPropertyCount]);

  function validateStep(currentStep: number) {
    setSetupError('');

    if (currentStep === 1 && !propertyType) {
      setSetupError('Please select a property type.');
      return false;
    }

    if (currentStep === 2) {
      if (!propertyName || !city || !stateName) {
        setSetupError(
          'Please complete the property name, city, and state.'
        );
        return false;
      }
    }

    if (currentStep === 6) {
      if (!agreeTerms || !agreePayroll) {
        setSetupError(
          'Please accept the agreements before continuing.'
        );
        return false;
      }
    }

    if (currentStep === 7) {
      if (!stripeConnected) {
        setSetupError(
          'Please connect Stripe before continuing.'
        );
        return false;
      }
    }

    return true;
  }

  function nextStep() {
    if (!validateStep(step)) return;

    setStep((current) => current + 1);
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 1));
  }

  async function handleConnectStripe() {
    try {
      setSetupError('');

      const response = await fetch('/api/setup/create-draft-property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          propertyType,
          propertyName,
          city,
          stateName,
          primaryColor,
          accentColor,
          monthlyPrice,
          launchMode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setSetupError(data.error || 'Unable to create draft property.');
        return;
      }

      setPropertyId(data.propertyId);

      const connectResponse = await fetch(
        `/api/stripe/connect/${data.propertyId}`,
        {
          method: 'POST'
        }
      );

      const connectData = await connectResponse.json();

      if (!connectResponse.ok) {
        setSetupError(connectData.error || 'Unable to start Stripe onboarding.');
        return;
      }

      sessionStorage.setItem(
        'roomflowSetupState',
        JSON.stringify({
          propertyType,
          propertyName,
          city,
          stateName,
          primaryColor,
          accentColor,
          roomSetupMode,
          startRoom,
          endRoom,
          excludedRooms,
          uploadedRooms,
          additionalRooms,
          launchMode,
          monthlyPrice
        })
      );

      window.location.href = connectData.url;
    } catch (error) {
      console.error(error);
      setSetupError('Unable to connect Stripe.');
    }
  }

  async function handleGenerateProperty() {
    try {
      if (!propertyId) {
        setSetupError(
          'Stripe onboarding must be completed before generating the property.'
        );
        return;
      }

      const response = await fetch(`/api/setup/finalize-property/${propertyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rooms,
          roomCount,
          launchMode,
          monthlyPrice
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setSetupError(data.error || 'Something went wrong.');
        return;
      }

      window.location.href = `/portal/${data.propertyId}`;
    } catch (error) {
      console.error(error);
      setSetupError('Something went wrong creating the property.');
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '36px 18px',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#64748b',
              fontWeight: 800
            }}
          >
            RoomFlow Setup
          </div>

          <h1
            style={{
              fontSize: 40,
              color: '#0f172a',
              margin: '8px 0 8px'
            }}
          >
            Create your property tipping experience.
          </h1>

          <p style={{ color: '#64748b', margin: 0 }}>
            Set up your branded QR tipping page, rooms, pricing, and asset package.
          </p>
        </div>

        <Progress step={step} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: 24,
            alignItems: 'start'
          }}
        >
          <section style={cardStyle}>
            {step === 1 && (
              <StepCard
                title="Property Type"
                subtitle="Choose the type of property you are setting up."
              >
                <div style={optionGridStyle}>
                  <OptionCard
                    active={propertyType === 'str'}
                    title="STR / Vacation Rental"
                    description="Best for Airbnb, VRBO, direct booking, and vacation rental properties."
                    onClick={() => setPropertyType('str')}
                  />

                  <OptionCard
                    active={propertyType === 'hotel'}
                    title="Hotel"
                    description="Best for room-based hotel tipping, reporting, and guest room QR codes."
                    onClick={() => setPropertyType('hotel')}
                  />
                </div>
              </StepCard>
            )}

            {step === 2 && (
              <StepCard
                title="Property Information"
                subtitle="This controls the branding shown to guests."
              >
                <Field label="Property Name">
                  <input
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    placeholder="Upper Echelon at The Domain"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Logo Upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setLogoFile(file);
                    }}
                    style={inputStyle}
                  />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="City">
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Austin"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="State">
                    <input
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="TX"
                      style={inputStyle}
                    />
                  </Field>
                </div>

                {isSTR && (
                  <Field label="Number of STR Properties">
                    <input
                      value={strPropertyCount}
                      onChange={(e) => setStrPropertyCount(e.target.value)}
                      type="number"
                      min="1"
                      placeholder="1"
                      style={inputStyle}
                    />
                  </Field>
                )}

                {isSTR && (
                  <div style={summaryBoxStyle}>
                    <strong>QR Code Setup</strong>

                    <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
                      <label style={checkboxLabelStyle}>
                        <input
                          type="radio"
                          checked={strQrMode === 'per_property'}
                          onChange={() => setStrQrMode('per_property')}
                        />
                        One QR code per STR property
                      </label>

                      <label style={checkboxLabelStyle}>
                        <input
                          type="radio"
                          checked={strQrMode === 'shared'}
                          onChange={() => setStrQrMode('shared')}
                        />
                        One shared QR code for all STR properties
                      </label>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Primary Color">
                    <input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#0B102F"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Accent Color">
                    <input
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      placeholder="#B88A44"
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <div
                  style={{
                    marginTop: 14,
                    padding: 16,
                    borderRadius: 16,
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    color: '#64748b'
                  }}
                >
                  Logo upload comes next. For now, this preview uses your property name,
                  colors, and location.
                </div>
              </StepCard>
            )}

            {step === 3 && (
              <StepCard
                title="Live Preview"
                subtitle="Review how your guest-facing tipping page will feel."
              >
                <div style={miniNoteStyle}>
                  This preview updates from your property information. The live QR page will use
                  the same branding and language.
                </div>
              </StepCard>
            )}

            {step === 4 && (
              <StepCard
                title={isHotel ? 'Guest Rooms' : 'Asset Setup'}
                subtitle={
                  isHotel
                    ? 'Generate QR codes for each guest room.'
                    : 'Your STR property package will include QR materials ready to place.'
                }
              >
                {isSTR && (
                  <div style={summaryBoxStyle}>
                    <strong>Included for STR / Vacation Rental:</strong>
                    <ul style={{ marginBottom: 0 }}>
                      <li>{roomCount} branded QR tipping page{roomCount > 1 ? 's' : ''}</li>
                      <li>{roomCount} QR code{roomCount > 1 ? 's' : ''}</li>
                      <li>4x6 print-ready card</li>
                      <li>8.5x11 print-ready poster</li>
                      <li>Setup kit packaging ready for placement</li>
                    </ul>
                  </div>
                )}

                {isHotel && (
                  <>
                    <div style={optionGridStyle}>
                      <OptionCard
                        active={roomSetupMode === 'range'}
                        title="Generate Room Range"
                        description="Recommended. Enter your guest room range and exclude rooms if needed."
                        onClick={() => setRoomSetupMode('range')}
                      />

                      <OptionCard
                        active={roomSetupMode === 'upload'}
                        title="Upload Room List"
                        description="Paste room numbers from your existing room list or spreadsheet."
                        onClick={() => setRoomSetupMode('upload')}
                      />
                    </div>

                    {roomSetupMode === 'range' && (
                      <div style={{ marginTop: 20 }}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 14
                          }}
                        >
                          <Field label="Start Room">
                            <input
                              value={startRoom}
                              onChange={(e) => setStartRoom(e.target.value)}
                              style={inputStyle}
                            />
                          </Field>

                          <Field label="End Room">
                            <input
                              value={endRoom}
                              onChange={(e) => setEndRoom(e.target.value)}
                              style={inputStyle}
                            />
                          </Field>
                        </div>

                        <Field label="Exclude Rooms">
                          <input
                            value={excludedRooms}
                            onChange={(e) => setExcludedRooms(e.target.value)}
                            placeholder="113, 114, 201"
                            style={inputStyle}
                          />
                        </Field>
                      </div>
                    )}

                    {roomSetupMode === 'upload' && (
                      <Field label="Paste Room List">
                        <textarea
                          value={uploadedRooms}
                          onChange={(e) => setUploadedRooms(e.target.value)}
                          placeholder={'101\n102\n103\n104'}
                          style={textareaStyle}
                        />
                      </Field>
                    )}

                    <Field label="Additional Rooms / Add-ons">
                      <textarea
                        value={additionalRooms}
                        onChange={(e) => setAdditionalRooms(e.target.value)}
                        placeholder={'PH1\nSuite 1001\nMeeting Room A'}
                        style={textareaStyle}
                      />
                    </Field>

                    <div style={summaryBoxStyle}>
                      <strong>{roomCount} guest rooms will be created.</strong>
                      <p style={{ margin: '8px 0 0', color: '#64748b' }}>
                        First: {rooms.slice(0, 3).join(', ') || '—'}
                      </p>
                      <p style={{ margin: '4px 0 0', color: '#64748b' }}>
                        Last: {rooms.slice(-3).join(', ') || '—'}
                      </p>
                    </div>
                  </>
                )}
              </StepCard>
            )}

            {step === 5 && (
              <StepCard
                title="Pricing Preview"
                subtitle="Pricing is calculated from your property type and room/property count."
              >
                <div style={pricingCardStyle}>
                  <div style={{ color: '#64748b', fontWeight: 700 }}>
                    Recommended Monthly Plan
                  </div>

                  <div style={{ fontSize: 42, fontWeight: 900, color: '#0f172a' }}>
                    {monthlyPrice ? `$${monthlyPrice}` : 'Contact Us'}
                    {monthlyPrice && <span style={{ fontSize: 16 }}>/month</span>}
                  </div>

                  <p style={{ color: '#64748b', marginBottom: 0 }}>
                    {isHotel
                      ? `${roomCount} guest rooms detected.`
                      : `${roomCount} STR ${roomCount === 1 ? 'property' : 'properties'} detected.`}
                  </p>
                </div>

                <div style={summaryBoxStyle}>
                  <strong>Pricing note:</strong>
                  <p style={{ marginBottom: 0, color: '#64748b' }}>
                    Pilot and custom pricing can be applied by RoomFlow when needed.
                    This screen shows the standard recommended plan.
                  </p>
                </div>
              </StepCard>
            )}

            {step === 6 && (
              <StepCard
                title="Agreement"
                subtitle="Confirm the operating terms before generating assets."
              >
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  I agree to the RoomFlow Terms of Service and Privacy Policy.
                </label>

                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={agreePayroll}
                    onChange={(e) => setAgreePayroll(e.target.checked)}
                  />
                  I understand RoomFlow is not a payroll provider and supports my
                  existing distribution process.
                </label>

                <div style={summaryBoxStyle}>
                  <strong>Launch Option</strong>

                  <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
                    <label style={checkboxLabelStyle}>
                      <input
                        type="radio"
                        checked={launchMode === 'pilot'}
                        onChange={() => setLaunchMode('pilot')}
                      />
                      Start with 14-Day Pilot — Recommended
                    </label>

                    <label style={checkboxLabelStyle}>
                      <input
                        type="radio"
                        checked={launchMode === 'active'}
                        onChange={() => setLaunchMode('active')}
                      />
                      Activate property immediately
                    </label>
                  </div>
                </div>

                <div style={summaryBoxStyle}>
                  Stripe Connect setup will be added next. This will allow payouts to be
                  connected directly to the property account.
                </div>
              </StepCard>
            )}

            {step === 7 && (
              <StepCard
                title="Connect Stripe"
                subtitle="Connect payouts before generating the property and QR assets."
              >
                <div style={summaryBoxStyle}>
                  <strong>Stripe Hosted Onboarding</strong>

                  <p style={{ marginBottom: 0, color: '#64748b' }}>
                    RoomFlow uses Stripe Connect so payouts can be routed directly to the
                    property account. Stripe will securely collect the required business,
                    banking, and verification information.
                  </p>
                </div>

                <div style={summaryBoxStyle}>
                  <strong>Launch Mode</strong>

                  <p style={{ marginBottom: 0, color: '#64748b' }}>
                    {launchMode === 'pilot'
                      ? 'This property will start in a 14-day pilot before activation.'
                      : 'This property will be marked active after setup is complete.'}
                  </p>
                </div>

                <div style={{ marginTop: 20 }}>
                  <button
                    type="button"
                    onClick={handleConnectStripe}
                    style={{
                      ...buttonStyle,
                      opacity: agreeTerms && agreePayroll ? 1 : 0.55
                    }}
                    disabled={!agreeTerms || !agreePayroll}
                  >
                    Connect Stripe
                  </button>
                </div>
              </StepCard>
            )}

            {step === 8 && (
              <StepCard
                title="Asset Package Preview"
                subtitle="These are the assets RoomFlow will generate for this property."
              >
                <div style={optionGridStyle}>
                  <AssetCard title="4x6 QR Card" description="Acrylic display-ready card." />
                  <AssetCard title="8.5x11 Poster" description="Full-page printable poster." />
                  <AssetCard title="QR PNG" description="Standalone QR file for backup use." />
                </div>

                <div style={summaryBoxStyle}>
                  <strong>Ready to Generate</strong>

                  <p style={{ marginBottom: 0, color: '#64748b' }}>
                    RoomFlow will create the property, rooms or units, QR tokens, guest
                    links, and downloadable asset packages.
                  </p>
                </div>

                <div style={{ marginTop: 20 }}>
                  <button
                    type="button"
                    onClick={handleGenerateProperty}
                    style={{
                      ...buttonStyle,
                      opacity: agreeTerms && agreePayroll && stripeConnected ? 1 : 0.55
                    }}
                    disabled={!agreeTerms || !agreePayroll || !stripeConnected}
                  >
                    Generate Property
                  </button>
                </div>
              </StepCard>
            )}

            {setupError && (
              <div style={setupErrorStyle}>
                {setupError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {step > 1 && (
                <button type="button" onClick={previousStep} style={secondaryButtonStyle}>
                  Back
                </button>
              )}

              {step < 8 && (
                <button type="button" onClick={nextStep} style={buttonStyle}>
                  Continue
                </button>
              )}
            </div>
          </section>

          <aside style={previewShellStyle}>
            <GuestPreview
              propertyType={propertyType}
              propertyName={propertyName}
              city={city}
              stateName={stateName}
              primaryColor={primaryColor}
              accentColor={accentColor}
            />

            <div style={{ padding: 20, borderTop: '1px solid #e2e8f0' }}>
              <h3 style={{ marginTop: 0, color: '#0f172a' }}>Setup Summary</h3>

              <SummaryLine label="Property Type" value={labelForPropertyType(propertyType)} />
              <SummaryLine
                label={isHotel ? 'Guest Rooms' : 'STR Properties'}
                value={String(roomCount)}
              />
              <SummaryLine
                label="Monthly Plan"
                value={monthlyPrice ? `$${monthlyPrice}/month` : 'Contact Us'}
              />
              <SummaryLine label="Assets" value="4x6, 8.5x11, QR PNG" />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Progress({ step }: { step: number }) {
  const labels = ['Type', 'Info', 'Preview', 'Rooms', 'Pricing', 'Agreement', 'Assets'];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${labels.length}, 1fr)`,
        gap: 8,
        marginBottom: 24
      }}
    >
      {labels.map((label, index) => {
        const active = step >= index + 1;

        return (
          <div key={label}>
            <div
              style={{
                height: 8,
                borderRadius: 999,
                background: active ? '#0B102F' : '#e2e8f0'
              }}
            />
            <div
              style={{
                marginTop: 6,
                fontSize: 11,
                color: active ? '#0f172a' : '#94a3b8',
                fontWeight: 700
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StepCard({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h2 style={{ marginTop: 0, color: '#0f172a' }}>{title}</h2>
      <p style={{ color: '#64748b', marginBottom: 22 }}>{subtitle}</p>
      {children}
    </>
  );
}

function OptionCard({
  active,
  title,
  description,
  onClick
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: 'left',
        border: active ? '2px solid #0B102F' : '1px solid #e2e8f0',
        background: active ? '#f8fafc' : '#ffffff',
        borderRadius: 18,
        padding: 18,
        cursor: 'pointer'
      }}
    >
      <div style={{ fontWeight: 900, color: '#0f172a', marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ color: '#64748b', lineHeight: 1.5 }}>{description}</div>
    </button>
  );
}

function AssetCard({ title, description }: { title: string; description: string }) {
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 18,
        padding: 18,
        background: '#ffffff'
      }}
    >
      <strong>{title}</strong>
      <p style={{ color: '#64748b', marginBottom: 0 }}>{description}</p>
    </div>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: 'block', color: '#0f172a', fontWeight: 700 }}>
      {label}
      {children}
    </label>
  );
}

function GuestPreview({
  propertyType,
  propertyName,
  city,
  stateName,
  primaryColor,
  accentColor
}: {
  propertyType: PropertyType;
  propertyName: string;
  city: string;
  stateName: string;
  primaryColor: string;
  accentColor: string;
}) {
  const isHotel = propertyType === 'hotel';

  return (
    <div>
      <div style={{ background: primaryColor, padding: 24 }}>
        <div
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 12,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 700
          }}
        >
          Guest Appreciation
        </div>

        <h2 style={{ color: '#fff', marginBottom: 4 }}>
          {propertyName || 'Property Name'}
        </h2>

        <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
          {[city, stateName].filter(Boolean).join(', ') || 'City, State'}
        </p>
      </div>

      <div style={{ padding: 26 }}>
        <p style={{ color: '#475569' }}>Thank you for your stay.</p>

        <h1 style={{ fontSize: 30, lineHeight: 1.15, color: '#0f172a' }}>
          {isHotel
            ? 'Support housekeeping for your room.'
            : 'Show your appreciation by leaving a tip for the cleaning team.'}
        </h1>

        <p style={{ color: '#64748b' }}>
          {isHotel
            ? '100% of your tip goes to the housekeeping team.'
            : 'A small gesture goes a long way.'}
        </p>

        {[5, 10, 20].map((amount, index) => (
          <div
            key={amount}
            style={{
              border: index === 1 ? `2px solid ${accentColor}` : '1px solid #e2e8f0',
              borderRadius: 20,
              padding: 18,
              marginBottom: 14
            }}
          >
            <strong style={{ fontSize: 24 }}>${amount}</strong>
            <div style={{ color: '#64748b', fontSize: 13 }}>
              {index === 0
                ? 'Quick thank you'
                : index === 1
                ? 'Standard tip ⭐'
                : 'Exceptional service'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        borderBottom: '1px solid #e2e8f0',
        padding: '10px 0',
        color: '#0f172a'
      }}
    >
      <span style={{ color: '#64748b' }}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function labelForPropertyType(type: PropertyType) {
  if (type === 'hotel') return 'Hotel';
  return 'STR / Vacation Rental';
}

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 24,
  padding: 24,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.04)'
};

const previewShellStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 24,
  overflow: 'hidden',
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.04)'
};

const optionGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 12
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 14px',
  borderRadius: 12,
  border: '1px solid #cbd5e1',
  margin: '8px 0 16px',
  fontSize: 15
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 130,
  resize: 'vertical'
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '15px 18px',
  borderRadius: 14,
  border: 'none',
  background: '#0B102F',
  color: '#fff',
  fontWeight: 800,
  cursor: 'pointer'
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: '#ffffff',
  color: '#0B102F',
  border: '1px solid #cbd5e1'
};

const summaryBoxStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 16,
  borderRadius: 16,
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  color: '#0f172a'
};

const miniNoteStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 16,
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  color: '#64748b',
  lineHeight: 1.6
};

const pricingCardStyle: React.CSSProperties = {
  padding: 22,
  borderRadius: 20,
  background: '#f8fafc',
  border: '1px solid #e2e8f0'
};

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  alignItems: 'flex-start',
  padding: 14,
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  marginBottom: 12,
  color: '#0f172a',
  lineHeight: 1.5
};

const setupErrorStyle: React.CSSProperties = {
  marginTop: 16,
  marginBottom: 16,
  padding: '12px 14px',
  borderRadius: 12,
  background: '#fef2f2',
  color: '#991b1b',
  fontWeight: 700,
  fontSize: 14
};