import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://likrkvcwlrioszjgwfzh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpa3JrdmN3bHJpb3N6amd3ZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTY1OTYsImV4cCI6MjA5NzQzMjU5Nn0.TW1lTTqpD_8VbPp8kN-d9AZ1sYBGv1hZyPxyzI20ym8'
)