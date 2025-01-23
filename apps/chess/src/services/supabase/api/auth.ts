import { createClient } from "../server";

class AuthService {
  public static async signInAnonymously() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
  }

  public static async signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  public static async signIn(email: string, password: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  public static async signUp(email: string, password: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://chess.danielbilek.com",
      },
    });
    if (error) throw error;
    return data;
  }

  public static async resetPassword(email: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://chess.danielbilek.com",
    });
    if (error) throw error;
  }

  public static async updatePassword(newPassword: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  }
}

export { AuthService }
