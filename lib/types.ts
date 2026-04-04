export type PropertyBranding = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
  welcome_message: string;
  thank_you_message: string;
  tip_preset_1: number;
  tip_preset_2: number;
  tip_preset_3: number;
};

export type RoomFlowContext = {
  token: string;
  roomId: string;
  roomNumber: string;
  staffName?: string | null;
  property: PropertyBranding;
};
