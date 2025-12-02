import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fjnpgvlzwyezcucypjak.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqbnBndmx6d3llemN1Y3lwamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODM1MzIsImV4cCI6MjA3Nzg1OTUzMn0.7ePobKoum4xJ-n47ZyxdNSxctQ1NF3br6LbPtJyK04U";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
