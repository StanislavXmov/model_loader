import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type ModelState = {
  name: string | null;
  model: File | null;
  preview: File | null;
  isPreview: boolean;
  setName: (s: string) => void;
  setModel: (f: File) => void;
  setPreview: (f: File) => void;
  setIsPreview: (b: boolean) => void;
}

export const useModelStore = create<ModelState>()(subscribeWithSelector((set) => ({
  name: null,
  model: null,
  preview: null,
  isPreview: false,
  setName: (s) => set(() => ({name: s})),
  setModel: (f) => set(() => ({model: f})),
  setPreview: (f) => set(() => ({preview: f})),
  setIsPreview: (b) => set(() => ({isPreview: b})),
})));