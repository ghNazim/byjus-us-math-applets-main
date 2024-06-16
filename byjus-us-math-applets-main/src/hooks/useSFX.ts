import useSound from 'use-sound'
import type { SpriteMap } from 'use-sound/dist/types'

import { sprite } from '@/assets/sounds/sfxSprite.json'
import sfxSprite from '@/assets/sounds/sfxSprite.mp3'

import { useMemoizedCallback } from './useMemoizedCallback'

export const useSFX = (id: keyof typeof sprite) => {
  const [play] = useSound(sfxSprite, { sprite: sprite as unknown as SpriteMap })
  return useMemoizedCallback(() => play({ id }))
}
