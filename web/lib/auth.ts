import { supabase } from './supabase'

// create a new user
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { data, error }
}

// login existing user
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// logout
export async function logout() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// get current session
export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  return { session, error }
}
