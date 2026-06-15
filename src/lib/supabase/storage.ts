"use server"

import { createClient } from './server'

const BUCKET = 'incident-photos'

export async function uploadIncidentPhoto(formData: FormData): Promise<string | null> {
  try {
    const supabase = await createClient()
    const file = formData.get('photo') as File

    if (!file || file.size === 0) return null

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName)

    return urlData.publicUrl
  } catch {
    return null
  }
}
