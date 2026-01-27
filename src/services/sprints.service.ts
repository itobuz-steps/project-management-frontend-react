// src/services/sprint.service.ts
import type {
  Sprint,
  CreateSprintPayload,
  UpdateSprintPayload,
} from './types/sprints.types';
import { config } from '../config/config';

const BASE_URL = `${config.api_base_url}/sprint`;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/* ---------------- GET ALL SPRINTS ---------------- */
export const getSprints = async (): Promise<Sprint[]> => {
  const res = await fetch(`${BASE_URL}/`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Failed to fetch sprints');
  return res.json();
};

/* ---------------- CREATE SPRINT ---------------- */
export const createSprint = async (
  payload: CreateSprintPayload
): Promise<Sprint> => {
  const res = await fetch(`${BASE_URL}/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to create sprint');
  return res.json();
};

/* ---------------- GET SPRINT BY ID ---------------- */
export const getSprintById = async (sprintId: string): Promise<Sprint> => {
  const res = await fetch(`${BASE_URL}/${sprintId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Failed to fetch sprint');
  return res.json();
};

/* ---------------- UPDATE SPRINT ---------------- */
export const updateSprint = async (
  sprintId: string,
  payload: UpdateSprintPayload
): Promise<Sprint> => {
  const res = await fetch(`${BASE_URL}/${sprintId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to update sprint');
  return res.json();
};

/* ---------------- DELETE SPRINT ---------------- */
export const deleteSprint = async (sprintId: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${sprintId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Failed to delete sprint');
};
