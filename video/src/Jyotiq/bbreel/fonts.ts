import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadDela } from "@remotion/google-fonts/DelaGothicOne";
import { loadFont as loadDeva } from "@remotion/google-fonts/NotoSansDevanagari";

/** Heavy Japanese-poster display face for the anime title cards. */
export const ANIME = loadDela("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

/** The Android app's serif ("Namaste, Ayush", "Where Does Your Light Fall?", JYOTIQ splash). */
export const CORMORANT = loadCormorant("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily;
loadCormorant("italic", { weights: ["500"], subsets: ["latin"] });

/** Devanagari: "तमसो मा ज्योतिर्गमय" on the home screen, मंगल / शनि on the clash card. */
export const DEVA = loadDeva("normal", { weights: ["400", "700"], subsets: ["devanagari"] }).fontFamily;
