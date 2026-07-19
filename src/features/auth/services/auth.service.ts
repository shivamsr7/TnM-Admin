import { supabase } from "@/lib/supabase";

export const authService = {
  async login(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  async logout() {
    return await supabase.auth.signOut();
  },

  async getSession() {
    return await supabase.auth.getSession();
  },

  onAuthStateChange(
    callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
  ) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async resetPassword(email: string) {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },
};