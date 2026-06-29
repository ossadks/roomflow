'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import {
  Copy,
  ExternalLink,
  QrCode,
  CreditCard,
  FileImage,
  Search,
  Printer
} from 'lucide-react';

type RoomQrToken = {
  id: string;
  token: string;
  room_id?: string | null;
  rooms?:
    | {
        id?: string;
        room_number?: string | null;
        property_id?: string | null;
      }
    | {
        id?: string;
        room_number?: string | null;
        property_id?: string | null;
      }[]
    | null;
};

export default function RoomQRLookup({
  qrTokens
}: {
  qrTokens: RoomQrToken[];
}) {
  const normalizedTokens = useMemo(() => {
    return qrTokens
      .map((item) => {
        const room = Array.isArray(item.rooms) ? item.rooms[0] : item.rooms;

        return {
          ...item,
          roomNumber: room?.room_number || 'Property'
        };
      })
      .sort((a, b) =>
        String(a.roomNumber).localeCompare(String(b.roomNumber), undefined, {
          numeric: true
        })
      );
  }, [qrTokens]);

  const [selectedTokenId, setSelectedTokenId] = useState(
    normalizedTokens[0]?.id || ''
  );

  const [copied, setCopied] = useState(false);

  const selectedToken =
    normalizedTokens.find((item) => item.id === selectedTokenId) ||
    normalizedTokens[0];

  if (!selectedToken) {
    return (
      <div style={lookupCardStyle}>
        <h3 style={{ margin: 0 }}>Room QR Lookup</h3>
        <p style={mutedStyle}>No room QR codes are available yet.</p>
      </div>
    );
  }

  const guestPath = `/q/${selectedToken.token}`;
  const guestUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${guestPath}`
      : guestPath;

  async function copyLink() {
    await navigator.clipboard.writeText(guestUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section style={lookupCardStyle}>
      <div style={lookupHeaderStyle}>
        <div>
          <div style={eyebrowStyle}>Room Manager</div>
          <h2 style={titleStyle}>Room QR Lookup</h2>
          <p style={mutedStyle}>
            Select a room to copy its guest link, open the guest page, or
            download room-specific assets.
          </p>
        </div>

        <div style={iconBadgeStyle}>
          <QrCode size={28} />
        </div>
      </div>

      <div style={selectorWrapStyle}>
        <label style={labelStyle}>Select Room</label>

        <div style={selectShellStyle}>
          <Search size={18} color="#64748b" />

          <select
            value={selectedToken.id}
            onChange={(event) => {
              setSelectedTokenId(event.target.value);
              setCopied(false);
            }}
            style={selectStyle}
          >
            {normalizedTokens.map((item) => (
              <option key={item.id} value={item.id}>
                Room {item.roomNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={selectedRoomStyle}>
        <div>
          <div style={miniLabelStyle}>Selected Room</div>
          <div style={roomTitleStyle}>Room {selectedToken.roomNumber}</div>
        </div>

        <span style={activeBadgeStyle}>QR Active</span>
      </div>

      <div style={linkBoxStyle}>
        <div style={miniLabelStyle}>Guest Link</div>
        <div style={linkTextStyle}>{guestUrl}</div>
      </div>

      <div style={primaryActionsStyle}>
        <button type="button" onClick={copyLink} style={primaryButtonStyle}>
          <Copy size={16} />
          {copied ? 'Copied' : 'Copy Link'}
        </button>

        <a
          href={guestPath}
          target="_blank"
          rel="noreferrer"
          style={secondaryButtonStyle}
        >
          <ExternalLink size={16} />
          Open Guest Page
        </a>
      </div>

      <div style={roomAssetsStyle}>
        <div style={roomAssetsHeaderStyle}>
          <div>
            <h3 style={roomAssetsTitleStyle}>Room Assets</h3>
            <p style={roomAssetsDescriptionStyle}>
              Download assets for Room {selectedToken.roomNumber}.
            </p>
          </div>
        </div>

        <div style={assetActionGridStyle}>
          <a
            href={`/api/assets/qr/${selectedToken.token}`}
            target="_blank"
            rel="noreferrer"
            style={assetActionStyle}
          >
            <QrCode size={18} />
            <span>
              <strong>QR PNG</strong>
              <small>Download QR image</small>
            </span>
          </a>

          <a
            href={`/api/assets/card-4x6/${selectedToken.token}`}
            target="_blank"
            rel="noreferrer"
            style={assetActionStyle}
          >
            <CreditCard size={18} />
            <span>
              <strong>4x6 Card</strong>
              <small>Room placement card</small>
            </span>
          </a>

          <a
            href={`/api/assets/poster-8x11/${selectedToken.token}`}
            target="_blank"
            rel="noreferrer"
            style={assetActionStyle}
          >
            <FileImage size={18} />
            <span>
              <strong>Poster</strong>
              <small>Printable signage</small>
            </span>
          </a>

          <button type="button" onClick={() => window.print()} style={assetActionStyle}>
            <Printer size={18} />
            <span>
              <strong>Print</strong>
              <small>Print this page</small>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

const lookupCardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 24,
  padding: 24,
  background: '#ffffff',
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.04)'
};

const lookupHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 18,
  alignItems: 'flex-start',
  marginBottom: 24
};

const eyebrowStyle: React.CSSProperties = {
  color: '#D4AF37',
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  marginBottom: 8
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: '#0f172a',
  fontSize: 30,
  fontWeight: 900
};

const mutedStyle: React.CSSProperties = {
  margin: '8px 0 0',
  color: '#64748b',
  lineHeight: 1.5
};

const iconBadgeStyle: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: 18,
  background: '#0B102F',
  color: '#D4AF37',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const selectorWrapStyle: React.CSSProperties = {
  marginBottom: 18
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#64748b',
  fontSize: 13,
  fontWeight: 900,
  marginBottom: 8
};

const selectShellStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  border: '1px solid #cbd5e1',
  borderRadius: 14,
  padding: '0 14px',
  background: '#f8fafc'
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 0',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: '#0f172a',
  fontWeight: 900,
  fontSize: 15
};

const selectedRoomStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 18,
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  marginBottom: 14,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16
};

const miniLabelStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: 12,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: '.08em'
};

const roomTitleStyle: React.CSSProperties = {
  color: '#0f172a',
  fontSize: 28,
  fontWeight: 900,
  marginTop: 4
};

const activeBadgeStyle: React.CSSProperties = {
  borderRadius: 999,
  padding: '8px 12px',
  background: '#dcfce7',
  color: '#166534',
  fontSize: 13,
  fontWeight: 900
};

const linkBoxStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 18,
  background: '#020617',
  color: '#ffffff',
  marginBottom: 16
};

const linkTextStyle: React.CSSProperties = {
  marginTop: 8,
  wordBreak: 'break-all',
  fontWeight: 800
};

const primaryActionsStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  marginBottom: 22
};

const primaryButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 16px',
  borderRadius: 14,
  background: '#0B102F',
  color: '#ffffff',
  border: 'none',
  textDecoration: 'none',
  fontWeight: 900,
  fontSize: 14,
  cursor: 'pointer'
};

const secondaryButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  background: '#ffffff',
  color: '#0B102F',
  border: '1px solid #cbd5e1'
};

const roomAssetsStyle: React.CSSProperties = {
  borderTop: '1px solid #e2e8f0',
  paddingTop: 20,
  marginTop: 4
};

const roomAssetsHeaderStyle: React.CSSProperties = {
  marginBottom: 16
};

const roomAssetsTitleStyle: React.CSSProperties = {
  color: '#0f172a',
  fontSize: 22,
  fontWeight: 900,
  margin: 0
};

const roomAssetsDescriptionStyle: React.CSSProperties = {
  margin: '6px 0 0',
  color: '#64748b'
};

const assetActionGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 12
};

const assetActionStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  padding: 16,
  borderRadius: 18,
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  color: '#0f172a',
  textDecoration: 'none',
  cursor: 'pointer',
  font: 'inherit'
};