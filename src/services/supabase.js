import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://ilstrejnkjfbjxkouwsw.supabase.co";
const supabaseKey = "sb_publishable_ncLsT3T6Guos3ZrviuJE0w_oLi6nV6Q";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
