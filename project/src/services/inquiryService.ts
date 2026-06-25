export interface BuyEquipmentPayload {
  equipment_id: number | string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  message: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function buyEquipment(payload: BuyEquipmentPayload) {
  const response = await fetch(`${API_URL}buy-equipment/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.detail || error?.message || 'Failed to send inquiry');
  }

  return response.json();
}

export async function getMyInquiries() {
  const tokensRaw = localStorage.getItem('tokens');
  if (!tokensRaw) throw new Error('Not authenticated');

  const tokens = JSON.parse(tokensRaw);
  const access = tokens?.access;
  if (!access) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}inquiries/mine/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.detail || 'Failed to load inquiries');
  }

  return response.json();
}