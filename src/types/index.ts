export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  created_at?: string;
}

export interface RecordingLog {
  id: string;
  user_id: string;
  file_url: string;
  latitude: number;
  longitude: number;
  created_at?: string;
}