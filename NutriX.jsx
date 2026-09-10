import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Home, UtensilsCrossed, BookOpen, MessageCircle, User, Camera, Plus, Search,
  Flame, Droplets, Trophy, Sparkles, X, ChevronRight, Send, Check, Award,
  Lock, Loader2, ImagePlus, Edit3, LogOut, Mail, KeyRound, ArrowRight, Eye, EyeOff,
  Coffee, IceCream, Cookie, Utensils, Sun, Moon, Settings as SettingsIcon, Trash2, PartyPopper
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { createClient } from "@supabase/supabase-js";
import { Analytics } from "@vercel/analytics/react";

/* ================================================================== */
/* Real cross-device backend (Supabase).                                */
/* Fill these in with YOUR project's values from                        */
/* Supabase Dashboard → Settings → API                                  */
/* ================================================================== */
const SUPABASE_URL = "https://gngitckqaneufixsmvoz.supabase.co"; // <-- replace this
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZ2l0Y2txYW5ldWZpeHNtdm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTI2ODEsImV4cCI6MjEwNDE2ODY4MX0.qiD7KZEcSlSAkCn45c9Yr-1mLvW7vei1PPFKnrCpJoE"; // <-- replace this
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ================================================================== */
/* i18n                                                                 */
/* ================================================================== */
const STRINGS = {
  en: {
    appName: "NutriX", tagline: "Eat well. Level up.",
    welcomeBack: "Welcome back", createAccount: "Create your account",
    loginSub: "Log in to pick up where you left off.",
    signupSub: "Sign up to start tracking with NutriX.",
    fullName: "Full name", email: "Email", password: "Password",
    loginBtn: "Log in", signupBtn: "Create account",
    noAccount: "New here?", haveAccount: "Already have an account?",
    signupLink: "Create an account", loginLink: "Log in instead",
    authError: "Check your details and try again.",
    onboardTitle: "Let's build your plan",
    onboardSub: "A few details so we can calculate your calorie and water goals.",
    name: "Your name", age: "Age", gender: "Gender", male: "Male", female: "Female",
    height: "Height (cm)", weight: "Weight (kg)", activity: "Activity level",
    sedentary: "Sedentary (little/no exercise)", light: "Light (1-3 days/week)",
    moderate: "Moderate (3-5 days/week)", active: "Active (6-7 days/week)",
    veryActive: "Very active (athlete)", goal: "Your goal", lose: "Lose weight",
    maintain: "Maintain weight", gain: "Gain weight", startBtn: "Calculate my plan",
    home: "Home", log: "Log", catalog: "Catalog", coach: "Coach", profile: "Profile",
    calories: "Calories", protein: "Protein", carbs: "Carbs", fat: "Fat", water: "Water",
    remaining: "remaining", dayStreak: "day streak", level: "Level", todaysMeals: "Today's meals",
    noMealsYet: "Nothing logged yet — add your first meal below.", addMeal: "Add a meal",
    snapPhoto: "Snap a photo", manualEntry: "Enter manually", fromCatalog: "From catalog",
    searchCuisine: "Search 114 dishes & drinks...", allCuisines: "All", badges: "Achievements", weightHistory: "Weight history",
    logWeight: "Log today's weight", askCoach: "Ask your coach anything...", coachIntro:
      "Hi! I'm your NutriX coach. Ask me about your nutrition, today's log, or your goals.",
    xpGained: "XP gained", levelUp: "Level Up!", newBadge: "Achievement Unlocked!",
    foodName: "Food name", addToLog: "Add to log", cancel: "Cancel", analyzing: "Analyzing photo...",
    confirmAdd: "Looks right? Add it", perServing: "per serving", ingredients: "Ingredients",
    steps: "Steps", close: "Close", glOfWater: "ml", trending: "Trending picks", logOut: "Log out",
    goodMorning: "Good morning", goodAfternoon: "Good afternoon", goodEvening: "Good evening",
    unlocked: "Unlocked", locked: "Locked", browseByType: "Browse by category",
    meals: "Meals", beverages: "Beverages", desserts: "Desserts", snacks: "Snacks", all: "All",
    settings: "Settings", darkMode: "Dark mode", language: "Language", account: "Account",
    deleteAccount: "Delete account", deleteConfirm: "This permanently deletes your saved data. Are you sure?",
    yesDelete: "Yes, delete it", nvm: "Never mind", dataNote: "Your account and progress are saved securely to your Claude account and will be here next time you open this app.",
    continue: "Nice!", bonusXp: "Bonus XP", version: "NutriX · Web Preview",
    motivational: [
      "Small bites, big progress — keep logging today.",
      "Your streak is proof you show up. Nice work.",
      "Hydration counts as much as the plate. Drink up.",
      "Every meal logged is a data point your future self thanks you for.",
    ],
  },
  ms: {
    appName: "NutriX", tagline: "Makan sihat. Naik tahap.",
    welcomeBack: "Selamat kembali", createAccount: "Cipta akaun anda",
    loginSub: "Log masuk untuk sambung semula.",
    signupSub: "Daftar untuk mula menjejak dengan NutriX.",
    fullName: "Nama penuh", email: "E-mel", password: "Kata laluan",
    loginBtn: "Log masuk", signupBtn: "Cipta akaun",
    noAccount: "Baru di sini?", haveAccount: "Sudah ada akaun?",
    signupLink: "Cipta akaun", loginLink: "Log masuk sahaja",
    authError: "Sila semak butiran anda dan cuba lagi.",
    onboardTitle: "Mari bina pelan anda",
    onboardSub: "Beberapa maklumat untuk kira sasaran kalori dan air anda.",
    name: "Nama anda", age: "Umur", gender: "Jantina", male: "Lelaki", female: "Perempuan",
    height: "Tinggi (cm)", weight: "Berat (kg)", activity: "Tahap aktiviti",
    sedentary: "Kurang bergerak", light: "Ringan (1-3 hari/minggu)",
    moderate: "Sederhana (3-5 hari/minggu)", active: "Aktif (6-7 hari/minggu)",
    veryActive: "Sangat aktif (atlet)", goal: "Matlamat anda", lose: "Turunkan berat",
    maintain: "Kekalkan berat", gain: "Naikkan berat", startBtn: "Kira pelan saya",
    home: "Utama", log: "Log", catalog: "Katalog", coach: "Jurulatih", profile: "Profil",
    calories: "Kalori", protein: "Protein", carbs: "Karbohidrat", fat: "Lemak", water: "Air",
    remaining: "berbaki", dayStreak: "hari berturut", level: "Tahap", todaysMeals: "Hidangan hari ini",
    noMealsYet: "Belum ada log — tambah hidangan pertama di bawah.", addMeal: "Tambah hidangan",
    snapPhoto: "Ambil gambar", manualEntry: "Masukkan manual", fromCatalog: "Dari katalog",
    searchCuisine: "Cari 114 hidangan & minuman...", allCuisines: "Semua", badges: "Pencapaian", weightHistory: "Sejarah berat",
    logWeight: "Log berat hari ini", askCoach: "Tanya jurulatih anda...", coachIntro:
      "Hai! Saya jurulatih NutriX anda. Tanya apa-apa tentang pemakanan atau log hari ini.",
    xpGained: "XP diperoleh", levelUp: "Naik Tahap!", newBadge: "Pencapaian Dibuka!",
    foodName: "Nama makanan", addToLog: "Tambah ke log", cancel: "Batal", analyzing: "Menganalisis gambar...",
    confirmAdd: "Betul? Tambah", perServing: "setiap hidangan", ingredients: "Bahan-bahan",
    steps: "Langkah", close: "Tutup", glOfWater: "ml", trending: "Pilihan popular", logOut: "Log keluar",
    goodMorning: "Selamat pagi", goodAfternoon: "Selamat tengahari", goodEvening: "Selamat petang",
    unlocked: "Dibuka", locked: "Berkunci", browseByType: "Layari ikut kategori",
    meals: "Hidangan", beverages: "Minuman", desserts: "Pencuci Mulut", snacks: "Snek", all: "Semua",
    settings: "Tetapan", darkMode: "Mod gelap", language: "Bahasa", account: "Akaun",
    deleteAccount: "Padam akaun", deleteConfirm: "Ini akan memadam data anda secara kekal. Anda pasti?",
    yesDelete: "Ya, padam", nvm: "Batal", dataNote: "Akaun dan kemajuan anda disimpan dengan selamat pada akaun Claude anda dan akan ada semula lain kali.",
    continue: "Bagus!", bonusXp: "Bonus XP", version: "NutriX · Pratonton Web",
    motivational: [
      "Sedikit demi sedikit, kemajuan besar — teruskan log hari ini.",
      "Streak anda bukti anda konsisten. Syabas.",
      "Air penting sama macam pinggan. Minum secukupnya.",
      "Setiap hidangan yang dilog adalah pelaburan untuk diri masa depan.",
    ],
  },
};

/* ================================================================== */
/* Catalog — 114 items: meals, beverages, desserts & snacks             */
/* Each maps to a real photograph fetched live from Wikipedia            */
/* ================================================================== */
const CATALOG = [
  { id: "my1", type: "meal", name: "Nasi Lemak", cuisine: "Malaysian", tags: ["halal"], cal: 560, p: 14, c: 68, f: 24, img: "🍚", wiki: "Nasi lemak", ingredients: ["Coconut rice", "Sambal", "Fried anchovies", "Boiled egg"], steps: ["Cook rice with coconut milk", "Fry anchovies & sambal", "Plate with egg & cucumber"] },
  { id: "my2", type: "meal", name: "Char Kway Teow", cuisine: "Malaysian", tags: ["halal"], cal: 620, p: 18, c: 70, f: 26, img: "🍜", wiki: "Char kway teow", ingredients: ["Flat rice noodles", "Prawns", "Egg", "Bean sprouts"], steps: ["Heat wok until smoking", "Stir-fry noodles with sauce", "Toss in egg & sprouts"] },
  { id: "my3", type: "meal", name: "Laksa", cuisine: "Malaysian", tags: ["spicy"], cal: 540, p: 20, c: 58, f: 22, img: "🍲", wiki: "Laksa", ingredients: ["Rice noodles", "Coconut curry broth", "Prawns", "Tofu puffs"], steps: ["Simmer spiced coconut broth", "Cook noodles", "Assemble with prawns & tofu puffs"] },
  { id: "my4", type: "meal", name: "Chicken Satay", cuisine: "Malaysian", tags: ["halal"], cal: 380, p: 30, c: 18, f: 20, img: "🍢", wiki: "Satay", ingredients: ["Chicken skewers", "Peanut sauce", "Turmeric marinade", "Rice cakes"], steps: ["Marinate chicken in spices", "Skewer and grill", "Serve with peanut sauce"] },
  { id: "jp1", type: "meal", name: "Salmon Sushi Set", cuisine: "Japanese", tags: ["pescatarian"], cal: 420, p: 28, c: 55, f: 9, img: "🍣", wiki: "Sushi", ingredients: ["Sushi rice", "Salmon", "Nori", "Rice vinegar"], steps: ["Season sushi rice", "Slice salmon", "Form nigiri, serve with soy sauce"] },
  { id: "jp2", type: "meal", name: "Chicken Ramen", cuisine: "Japanese", tags: [], cal: 550, p: 32, c: 58, f: 18, img: "🍲", wiki: "Ramen", ingredients: ["Ramen noodles", "Chicken broth", "Soft egg", "Scallions"], steps: ["Simmer broth with aromatics", "Cook noodles", "Assemble & top with egg"] },
  { id: "jp3", type: "meal", name: "Tonkatsu", cuisine: "Japanese", tags: [], cal: 640, p: 30, c: 52, f: 32, img: "🍱", wiki: "Tonkatsu", ingredients: ["Pork cutlet", "Panko breadcrumbs", "Cabbage", "Tonkatsu sauce"], steps: ["Bread the pork cutlet", "Deep fry until golden", "Slice, serve with sauce & cabbage"] },
  { id: "jp4", type: "meal", name: "Tempura Udon", cuisine: "Japanese", tags: [], cal: 520, p: 18, c: 74, f: 16, img: "🍤", wiki: "Tempura", ingredients: ["Udon noodles", "Prawn tempura", "Dashi broth", "Scallions"], steps: ["Fry tempura until crisp", "Heat dashi broth", "Combine with noodles & tempura"] },
  { id: "jp5", type: "meal", name: "Peking-style Roast Duck", cuisine: "Chinese", tags: [], cal: 520, p: 28, c: 30, f: 32, img: "🦆", wiki: "Peking duck", ingredients: ["Whole duck", "Hoisin sauce", "Scallion", "Thin pancakes"], steps: ["Air-dry & season duck", "Roast until skin is crisp", "Slice, serve with pancakes & hoisin"] },
  { id: "it1", type: "meal", name: "Spaghetti Carbonara", cuisine: "Italian", tags: [], cal: 650, p: 24, c: 72, f: 28, img: "🍝", wiki: "Carbonara", ingredients: ["Spaghetti", "Guanciale", "Egg yolk", "Pecorino"], steps: ["Cook pasta al dente", "Render guanciale", "Off heat, mix with egg & cheese"] },
  { id: "it2", type: "meal", name: "Margherita Pizza", cuisine: "Italian", tags: ["vegetarian"], cal: 720, p: 26, c: 88, f: 26, img: "🍕", wiki: "Pizza Margherita", ingredients: ["Pizza dough", "Tomatoes", "Mozzarella", "Basil"], steps: ["Stretch dough", "Top with tomato & mozzarella", "Bake hot, finish with basil"] },
  { id: "it3", type: "meal", name: "Lasagna", cuisine: "Italian", tags: [], cal: 680, p: 32, c: 58, f: 34, img: "🍛", wiki: "Lasagne", ingredients: ["Lasagna sheets", "Beef ragù", "Béchamel", "Parmesan"], steps: ["Layer pasta, ragù & béchamel", "Repeat layers, top with cheese", "Bake until bubbling"] },
  { id: "it4", type: "meal", name: "Mushroom Risotto", cuisine: "Italian", tags: ["vegetarian"], cal: 560, p: 14, c: 78, f: 18, img: "🍚", wiki: "Risotto", ingredients: ["Arborio rice", "Mushrooms", "Parmesan", "Vegetable stock"], steps: ["Toast rice", "Add stock gradually, stirring", "Fold in mushrooms & parmesan"] },
  { id: "it5", type: "meal", name: "Chicken Alfredo", cuisine: "Italian", tags: [], cal: 680, p: 32, c: 62, f: 34, img: "🍝", wiki: "Fettuccine Alfredo", ingredients: ["Fettuccine", "Grilled chicken", "Parmesan", "Cream"], steps: ["Cook fettuccine al dente", "Simmer cream & parmesan", "Toss with pasta & sliced chicken"] },
  { id: "th1", type: "meal", name: "Green Curry Chicken", cuisine: "Thai", tags: [], cal: 480, p: 26, c: 30, f: 30, img: "🍛", wiki: "Thai curry", ingredients: ["Green curry paste", "Coconut milk", "Chicken", "Thai basil"], steps: ["Fry paste in coconut cream", "Add chicken & coconut milk", "Finish with basil"] },
  { id: "th2", type: "meal", name: "Pad Thai", cuisine: "Thai", tags: [], cal: 590, p: 20, c: 76, f: 20, img: "🍤", wiki: "Pad thai", ingredients: ["Rice noodles", "Prawns", "Tamarind sauce", "Peanuts"], steps: ["Soak noodles", "Stir-fry with sauce", "Toss with peanuts & sprouts"] },
  { id: "th3", type: "meal", name: "Tom Yum Soup", cuisine: "Thai", tags: ["spicy"], cal: 280, p: 18, c: 14, f: 16, img: "🍲", wiki: "Tom yum", ingredients: ["Prawns", "Lemongrass", "Galangal", "Lime leaves"], steps: ["Simmer aromatics in broth", "Add prawns & mushrooms", "Season with lime & chili"] },
  { id: "in1", type: "meal", name: "Butter Chicken", cuisine: "Indian", tags: [], cal: 610, p: 34, c: 34, f: 36, img: "🍗", wiki: "Butter chicken", ingredients: ["Chicken thigh", "Tomato", "Butter", "Garam masala"], steps: ["Grill marinated chicken", "Cook tomato-butter base", "Simmer chicken in sauce"] },
  { id: "in2", type: "meal", name: "Chana Masala", cuisine: "Indian", tags: ["vegan", "vegetarian"], cal: 400, p: 16, c: 58, f: 10, img: "🥘", wiki: "Chana masala", ingredients: ["Chickpeas", "Onion", "Tomato", "Garam masala"], steps: ["Sauté onion & spices", "Add tomato, cook down", "Add chickpeas & simmer"] },
  { id: "in3", type: "meal", name: "Chicken Biryani", cuisine: "Indian", tags: [], cal: 660, p: 30, c: 80, f: 22, img: "🍛", wiki: "Biryani", ingredients: ["Basmati rice", "Chicken", "Fried onions", "Biryani spices"], steps: ["Marinate & part-cook chicken", "Layer with parboiled rice", "Steam until fragrant"] },
  { id: "in4", type: "meal", name: "Palak Paneer", cuisine: "Indian", tags: ["vegetarian"], cal: 420, p: 18, c: 22, f: 28, img: "🥬", wiki: "Palak paneer", ingredients: ["Spinach", "Paneer", "Cream", "Garlic-ginger"], steps: ["Blanch & purée spinach", "Sauté aromatics", "Simmer with paneer & cream"] },
  { id: "in5", type: "meal", name: "Masala Dosa", cuisine: "Indian", tags: ["vegetarian", "gluten-free"], cal: 380, p: 8, c: 62, f: 10, img: "🫓", wiki: "Dosa", ingredients: ["Fermented rice-lentil batter", "Spiced potato filling", "Coconut chutney"], steps: ["Spread batter thin on griddle", "Fill with spiced potato", "Fold and serve with chutney"] },
  { id: "in6", type: "meal", name: "Tandoori Chicken", cuisine: "Indian", tags: ["gluten-free"], cal: 420, p: 42, c: 8, f: 24, img: "🍗", wiki: "Tandoori chicken", ingredients: ["Chicken", "Yogurt marinade", "Tandoori spices", "Lemon"], steps: ["Marinate chicken overnight", "Roast in a very hot oven/tandoor", "Char and serve with lemon"] },
  { id: "kr1", type: "meal", name: "Bibimbap", cuisine: "Korean", tags: [], cal: 540, p: 22, c: 66, f: 18, img: "🍱", wiki: "Bibimbap", ingredients: ["Rice", "Assorted vegetables", "Fried egg", "Gochujang"], steps: ["Prepare seasoned vegetables", "Cook rice, fry egg", "Assemble bowl with gochujang"] },
  { id: "kr2", type: "meal", name: "Kimchi Fried Rice", cuisine: "Korean", tags: [], cal: 500, p: 15, c: 64, f: 18, img: "🍚", wiki: "Kimchi", ingredients: ["Day-old rice", "Kimchi", "Egg", "Sesame oil"], steps: ["Fry kimchi until fragrant", "Add rice, break up clumps", "Top with fried egg"] },
  { id: "kr3", type: "meal", name: "Korean Fried Chicken", cuisine: "Korean", tags: [], cal: 700, p: 34, c: 48, f: 40, img: "🍗", wiki: "Korean fried chicken", ingredients: ["Chicken wings", "Potato starch", "Gochujang glaze", "Sesame seeds"], steps: ["Double-fry chicken until crisp", "Simmer sweet-spicy glaze", "Toss chicken in glaze"] },
  { id: "kr4", type: "meal", name: "Beef Bulgogi", cuisine: "Korean", tags: [], cal: 520, p: 32, c: 30, f: 26, img: "🥩", wiki: "Bulgogi", ingredients: ["Thin beef slices", "Soy-pear marinade", "Garlic", "Scallions"], steps: ["Marinate beef", "Sear on high heat", "Serve with rice & scallions"] },
  { id: "cn1", type: "meal", name: "Kung Pao Chicken", cuisine: "Chinese", tags: [], cal: 520, p: 30, c: 32, f: 28, img: "🥡", wiki: "Kung Pao chicken", ingredients: ["Chicken breast", "Peanuts", "Dried chili", "Soy sauce"], steps: ["Velvet the chicken", "Stir-fry chilies & chicken", "Toss with peanuts & sauce"] },
  { id: "cn2", type: "meal", name: "Mapo Tofu", cuisine: "Chinese", tags: ["vegetarian-adaptable"], cal: 380, p: 20, c: 18, f: 26, img: "🥘", wiki: "Mapo tofu", ingredients: ["Silken tofu", "Ground pork", "Doubanjiang", "Sichuan peppercorn"], steps: ["Fry doubanjiang paste", "Add pork, then tofu", "Simmer, finish with pepper oil"] },
  { id: "cn3", type: "meal", name: "Dim Sum Dumplings", cuisine: "Chinese", tags: [], cal: 360, p: 16, c: 40, f: 14, img: "🥟", wiki: "Dim sum", ingredients: ["Dumpling wrappers", "Pork & prawn filling", "Ginger", "Soy dipping sauce"], steps: ["Mix filling", "Wrap dumplings", "Steam until translucent"] },
  { id: "cn4", type: "meal", name: "Sweet and Sour Pork", cuisine: "Chinese", tags: [], cal: 600, p: 26, c: 62, f: 24, img: "🍖", wiki: "Sweet and sour pork", ingredients: ["Pork chunks", "Pineapple", "Bell pepper", "Sweet-sour sauce"], steps: ["Batter & fry pork", "Stir-fry vegetables", "Toss all in sweet-sour sauce"] },
  { id: "cn5", type: "meal", name: "Chicken Fried Rice", cuisine: "Chinese", tags: [], cal: 520, p: 20, c: 68, f: 18, img: "🍚", wiki: "Fried rice", ingredients: ["Day-old rice", "Chicken", "Egg", "Soy sauce"], steps: ["Scramble egg, set aside", "Stir-fry chicken and rice", "Combine with egg & soy sauce"] },
  { id: "mx1", type: "meal", name: "Chicken Tacos", cuisine: "Mexican", tags: [], cal: 460, p: 28, c: 40, f: 20, img: "🌮", wiki: "Taco", ingredients: ["Corn tortillas", "Chicken", "Onion & cilantro", "Salsa"], steps: ["Season & grill chicken", "Warm tortillas", "Assemble tacos with salsa"] },
  { id: "mx2", type: "meal", name: "Veggie Burrito Bowl", cuisine: "Mexican", tags: ["vegan", "vegetarian"], cal: 520, p: 18, c: 78, f: 14, img: "🥗", wiki: "Burrito", ingredients: ["Rice", "Black beans", "Corn", "Avocado"], steps: ["Cook rice & beans", "Char corn", "Assemble bowl, top with avocado"] },
  { id: "mx3", type: "meal", name: "Cheese Quesadilla", cuisine: "Mexican", tags: ["vegetarian"], cal: 480, p: 20, c: 42, f: 26, img: "🧀", wiki: "Quesadilla", ingredients: ["Flour tortilla", "Cheese blend", "Peppers", "Salsa"], steps: ["Fill tortilla with cheese", "Fold & griddle until golden", "Slice, serve with salsa"] },
  { id: "mx4", type: "meal", name: "Beef Enchiladas", cuisine: "Mexican", tags: [], cal: 620, p: 28, c: 54, f: 30, img: "🌯", wiki: "Enchilada", ingredients: ["Corn tortillas", "Shredded beef", "Enchilada sauce", "Cheese"], steps: ["Fill & roll tortillas", "Cover with sauce & cheese", "Bake until bubbling"] },
  { id: "mx5", type: "meal", name: "Beef Fajitas", cuisine: "Mexican", tags: ["gluten-free"], cal: 560, p: 34, c: 46, f: 24, img: "🫓", wiki: "Fajita", ingredients: ["Sliced beef", "Bell peppers", "Onion", "Flour tortillas"], steps: ["Marinate & sear beef", "Sauté peppers and onion", "Serve sizzling with tortillas"] },
  { id: "fr1", type: "meal", name: "Ratatouille", cuisine: "French", tags: ["vegan", "vegetarian"], cal: 320, p: 6, c: 34, f: 18, img: "🍆", wiki: "Ratatouille", ingredients: ["Eggplant", "Zucchini", "Tomato", "Herbes de Provence"], steps: ["Slice vegetables thin", "Layer with sauce", "Bake until tender"] },
  { id: "fr2", type: "meal", name: "Croque Monsieur", cuisine: "French", tags: [], cal: 580, p: 26, c: 36, f: 36, img: "🥪", wiki: "Croque-monsieur", ingredients: ["Bread", "Ham", "Gruyère", "Béchamel"], steps: ["Make béchamel", "Layer bread, ham, cheese", "Bake until golden"] },
  { id: "fr3", type: "meal", name: "Coq au Vin", cuisine: "French", tags: [], cal: 560, p: 36, c: 18, f: 32, img: "🍗", wiki: "Coq au vin", ingredients: ["Chicken", "Red wine", "Mushrooms", "Pearl onions"], steps: ["Brown chicken pieces", "Braise in wine with vegetables", "Reduce sauce until glossy"] },
  { id: "fr4", type: "meal", name: "French Onion Soup", cuisine: "French", tags: ["vegetarian"], cal: 380, p: 14, c: 34, f: 20, img: "🍲", wiki: "French onion soup", ingredients: ["Caramelized onions", "Beef stock", "Baguette", "Gruyère"], steps: ["Slow-caramelize onions", "Simmer in stock", "Top with bread & cheese, broil"] },
  { id: "fr5", type: "meal", name: "Butter Croissant", cuisine: "French", tags: ["vegetarian"], cal: 290, p: 6, c: 32, f: 16, img: "🥐", wiki: "Croissant", ingredients: ["Laminated dough", "Butter", "Egg wash"], steps: ["Laminate dough with butter", "Shape & proof croissants", "Bake until golden & flaky"] },
  { id: "gr1", type: "meal", name: "Greek Chicken Salad", cuisine: "Greek", tags: ["gluten-free"], cal: 430, p: 34, c: 18, f: 26, img: "🥙", wiki: "Greek salad", ingredients: ["Grilled chicken", "Cucumber", "Feta", "Olives"], steps: ["Grill chicken", "Chop vegetables", "Combine with feta, olive oil & lemon"] },
  { id: "gr2", type: "meal", name: "Falafel Wrap", cuisine: "Greek", tags: ["vegan", "vegetarian"], cal: 480, p: 16, c: 60, f: 20, img: "🧆", wiki: "Falafel", ingredients: ["Chickpeas", "Herbs", "Tahini", "Flatbread"], steps: ["Blend chickpea mixture", "Fry falafel balls", "Wrap with tahini & pickles"] },
  { id: "gr3", type: "meal", name: "Moussaka", cuisine: "Greek", tags: [], cal: 620, p: 26, c: 32, f: 40, img: "🍆", wiki: "Moussaka", ingredients: ["Eggplant", "Ground lamb", "Tomato sauce", "Béchamel"], steps: ["Layer fried eggplant & meat sauce", "Top with béchamel", "Bake until golden"] },
  { id: "gr4", type: "meal", name: "Chicken Souvlaki", cuisine: "Greek", tags: ["gluten-free"], cal: 420, p: 36, c: 12, f: 22, img: "🍢", wiki: "Souvlaki", ingredients: ["Chicken skewers", "Lemon-oregano marinade", "Tzatziki", "Pita"], steps: ["Marinate chicken", "Skewer & grill", "Serve with tzatziki & pita"] },
  { id: "vn1", type: "meal", name: "Beef Pho", cuisine: "Vietnamese", tags: [], cal: 470, p: 28, c: 52, f: 12, img: "🍜", wiki: "Pho", ingredients: ["Rice noodles", "Beef", "Spiced broth", "Fresh herbs"], steps: ["Simmer spiced broth", "Cook rice noodles", "Assemble with beef & herbs"] },
  { id: "vn2", type: "meal", name: "Banh Mi", cuisine: "Vietnamese", tags: [], cal: 500, p: 20, c: 58, f: 20, img: "🥖", wiki: "Banh mi", ingredients: ["Baguette", "Pork & pâté", "Pickled carrot & daikon", "Cilantro"], steps: ["Toast baguette", "Layer pork & pickles", "Finish with cilantro & chili"] },
  { id: "vn3", type: "meal", name: "Fresh Spring Rolls", cuisine: "Vietnamese", tags: ["gluten-free"], cal: 280, p: 14, c: 36, f: 8, img: "🥗", wiki: "Spring roll", ingredients: ["Rice paper", "Prawns", "Rice vermicelli", "Herbs"], steps: ["Soften rice paper", "Layer filling", "Roll tightly, serve with dip"] },
  { id: "vn4", type: "meal", name: "Vietnamese Grilled Pork", cuisine: "Vietnamese", tags: [], cal: 520, p: 30, c: 44, f: 22, img: "🍖", wiki: "Bún chả", ingredients: ["Pork patties", "Rice vermicelli", "Fish sauce dressing", "Herbs"], steps: ["Marinate & grill pork", "Prepare dipping sauce", "Serve over noodles with herbs"] },
  { id: "sp1", type: "meal", name: "Seafood Paella", cuisine: "Spanish", tags: [], cal: 610, p: 30, c: 70, f: 20, img: "🥘", wiki: "Paella", ingredients: ["Bomba rice", "Saffron", "Prawns", "Mussels"], steps: ["Sear seafood", "Toast rice with saffron stock", "Simmer without stirring"] },
  { id: "sp2", type: "meal", name: "Spanish Tortilla", cuisine: "Spanish", tags: ["vegetarian", "gluten-free"], cal: 420, p: 16, c: 30, f: 26, img: "🍳", wiki: "Tortilla de patatas", ingredients: ["Potatoes", "Eggs", "Onion", "Olive oil"], steps: ["Slow-cook potatoes & onion", "Mix into beaten eggs", "Set in pan, flip to finish"] },
  { id: "sp3", type: "meal", name: "Gazpacho", cuisine: "Spanish", tags: ["vegan", "vegetarian", "gluten-free"], cal: 180, p: 4, c: 20, f: 10, img: "🍅", wiki: "Gazpacho", ingredients: ["Tomatoes", "Cucumber", "Bell pepper", "Olive oil"], steps: ["Blend vegetables smooth", "Season & chill", "Serve cold with a drizzle of oil"] },
  { id: "id1", type: "meal", name: "Beef Rendang", cuisine: "Indonesian", tags: ["halal"], cal: 640, p: 32, c: 20, f: 46, img: "🍛", wiki: "Rendang", ingredients: ["Beef chunks", "Coconut milk", "Lemongrass", "Chili paste"], steps: ["Brown beef", "Simmer in spiced coconut milk", "Reduce slowly until dark & dry"] },
  { id: "id2", type: "meal", name: "Nasi Goreng", cuisine: "Indonesian", tags: ["halal"], cal: 540, p: 18, c: 66, f: 20, img: "🍚", wiki: "Nasi goreng", ingredients: ["Day-old rice", "Sweet soy sauce", "Fried egg", "Shrimp paste"], steps: ["Fry aromatics & shrimp paste", "Add rice, toss with sauce", "Top with fried egg"] },
  { id: "id3", type: "meal", name: "Gado-Gado", cuisine: "Indonesian", tags: ["vegetarian"], cal: 420, p: 16, c: 34, f: 26, img: "🥗", wiki: "Gado-gado", ingredients: ["Blanched vegetables", "Tofu & tempeh", "Peanut sauce", "Boiled egg"], steps: ["Blanch vegetables", "Prepare peanut sauce", "Arrange & drizzle with sauce"] },
  { id: "am1", type: "meal", name: "Grilled Salmon Bowl", cuisine: "American", tags: ["gluten-free", "pescatarian"], cal: 490, p: 36, c: 32, f: 22, img: "🐟", wiki: "Salmon as food", ingredients: ["Salmon fillet", "Brown rice", "Broccoli", "Lemon"], steps: ["Season & grill salmon", "Steam broccoli", "Assemble bowl with rice"] },
  { id: "am2", type: "meal", name: "Classic Cheeseburger", cuisine: "American", tags: [], cal: 720, p: 34, c: 46, f: 42, img: "🍔", wiki: "Cheeseburger", ingredients: ["Beef patty", "Cheddar", "Brioche bun", "Lettuce & tomato"], steps: ["Grill patty, melt cheese on top", "Toast bun", "Stack with condiments"] },
  { id: "am3", type: "meal", name: "BBQ Pork Ribs", cuisine: "American", tags: [], cal: 780, p: 42, c: 30, f: 52, img: "🍖", wiki: "Spare ribs", ingredients: ["Pork ribs", "Dry rub", "BBQ sauce", "Coleslaw"], steps: ["Season & slow-cook ribs", "Glaze with BBQ sauce", "Finish under high heat"] },
  { id: "am4", type: "meal", name: "Poke Bowl", cuisine: "American", tags: ["pescatarian", "gluten-free"], cal: 480, p: 30, c: 56, f: 14, img: "🍚", wiki: "Poke (dish)", ingredients: ["Ahi tuna", "Sushi rice", "Edamame", "Soy-sesame dressing"], steps: ["Cube & marinate tuna", "Cook rice, cool slightly", "Assemble bowl with toppings"] },
  { id: "am5", type: "meal", name: "Southern Fried Chicken", cuisine: "American", tags: [], cal: 540, p: 32, c: 26, f: 34, img: "🍗", wiki: "Fried chicken", ingredients: ["Chicken pieces", "Buttermilk", "Seasoned flour", "Oil for frying"], steps: ["Soak chicken in buttermilk", "Dredge in seasoned flour", "Fry until golden & crisp"] },
  { id: "am6", type: "meal", name: "Chicken Caesar Salad", cuisine: "American", tags: [], cal: 420, p: 32, c: 14, f: 26, img: "🥗", wiki: "Caesar salad", ingredients: ["Grilled chicken", "Romaine lettuce", "Parmesan", "Caesar dressing"], steps: ["Grill & slice chicken", "Toss romaine with dressing", "Top with chicken & parmesan"] },
  { id: "am7", type: "meal", name: "Avocado Toast", cuisine: "American", tags: ["vegetarian"], cal: 380, p: 12, c: 40, f: 20, img: "🥑", wiki: "Avocado toast", ingredients: ["Sourdough bread", "Avocado", "Chili flakes", "Poached egg"], steps: ["Toast bread", "Mash & spread avocado", "Top with egg & chili flakes"] },
  { id: "am8", type: "meal", name: "Buttermilk Pancakes", cuisine: "American", tags: ["vegetarian"], cal: 430, p: 9, c: 68, f: 14, img: "🥞", wiki: "Pancake", ingredients: ["Flour", "Buttermilk", "Egg", "Maple syrup"], steps: ["Mix batter until just combined", "Cook on griddle until bubbly", "Flip, serve with syrup"] },
  { id: "am9", type: "meal", name: "Ribeye Steak", cuisine: "American", tags: ["gluten-free"], cal: 650, p: 48, c: 4, f: 48, img: "🥩", wiki: "Rib eye steak", ingredients: ["Ribeye steak", "Butter", "Garlic", "Rosemary"], steps: ["Sear steak hot on both sides", "Baste with butter, garlic & herbs", "Rest before slicing"] },
  { id: "am10", type: "meal", name: "Chili Con Carne", cuisine: "American", tags: ["gluten-free"], cal: 480, p: 30, c: 36, f: 22, img: "🌶️", wiki: "Chili con carne", ingredients: ["Ground beef", "Kidney beans", "Tomato", "Chili spices"], steps: ["Brown beef with spices", "Add tomato & beans", "Simmer until thick"] },
  { id: "am11", type: "meal", name: "New England Clam Chowder", cuisine: "American", tags: [], cal: 380, p: 16, c: 30, f: 22, img: "🥣", wiki: "Clam chowder", ingredients: ["Clams", "Potatoes", "Cream", "Bacon"], steps: ["Render bacon, sauté aromatics", "Add clams, stock & potatoes", "Finish with cream"] },
  { id: "am12", type: "meal", name: "Lobster Roll", cuisine: "American", tags: ["pescatarian"], cal: 460, p: 24, c: 38, f: 24, img: "🦞", wiki: "Lobster roll", ingredients: ["Lobster meat", "Mayonnaise", "Celery", "Toasted bun"], steps: ["Toss lobster with mayo & celery", "Toast split-top bun", "Pile lobster salad into bun"] },
  { id: "am13", type: "meal", name: "Chicken Pot Pie", cuisine: "American", tags: [], cal: 560, p: 22, c: 48, f: 30, img: "🥧", wiki: "Pot pie", ingredients: ["Chicken", "Mixed vegetables", "Cream sauce", "Pie crust"], steps: ["Cook chicken & vegetables in sauce", "Pour into pie dish", "Top with crust, bake until golden"] },
  { id: "gb1", type: "meal", name: "Fish and Chips", cuisine: "British", tags: ["pescatarian"], cal: 780, p: 32, c: 70, f: 42, img: "🍟", wiki: "Fish and chips", ingredients: ["White fish fillet", "Beer batter", "Potatoes", "Malt vinegar"], steps: ["Batter and fry the fish", "Double-fry thick-cut chips", "Serve with vinegar & tartare sauce"] },
  { id: "gb2", type: "meal", name: "Shepherd's Pie", cuisine: "British", tags: [], cal: 540, p: 26, c: 46, f: 26, img: "🥧", wiki: "Shepherd's pie", ingredients: ["Ground lamb", "Peas & carrots", "Mashed potato", "Gravy"], steps: ["Brown lamb with vegetables", "Spread in a dish, top with mash", "Bake until golden on top"] },
  { id: "gb3", type: "meal", name: "Full English Breakfast", cuisine: "British", tags: [], cal: 820, p: 38, c: 40, f: 54, img: "🍳", wiki: "Full breakfast", ingredients: ["Eggs", "Bacon & sausage", "Baked beans", "Toast"], steps: ["Grill bacon & sausage", "Fry eggs", "Plate with beans and toast"] },
  { id: "de1", type: "meal", name: "Bratwurst with Sauerkraut", cuisine: "German", tags: [], cal: 540, p: 24, c: 22, f: 38, img: "🌭", wiki: "Bratwurst", ingredients: ["Bratwurst sausage", "Sauerkraut", "Mustard", "Bread roll"], steps: ["Grill bratwurst until browned", "Warm sauerkraut", "Serve together with mustard"] },
  { id: "me1", type: "meal", name: "Hummus Platter", cuisine: "Middle Eastern", tags: ["vegan", "vegetarian"], cal: 380, p: 14, c: 40, f: 20, img: "🥙", wiki: "Hummus", ingredients: ["Chickpeas", "Tahini", "Lemon", "Pita bread"], steps: ["Blend chickpeas & tahini smooth", "Season with lemon & garlic", "Serve with warm pita"] },
  { id: "me2", type: "meal", name: "Chicken Shawarma Wrap", cuisine: "Middle Eastern", tags: ["halal"], cal: 560, p: 34, c: 48, f: 24, img: "🌯", wiki: "Shawarma", ingredients: ["Marinated chicken", "Flatbread", "Garlic sauce", "Pickles"], steps: ["Marinate & roast chicken", "Slice thin", "Wrap with sauce & pickles"] },
  { id: "me3", type: "meal", name: "Mixed Kebab Plate", cuisine: "Middle Eastern", tags: ["halal"], cal: 620, p: 40, c: 32, f: 34, img: "🍢", wiki: "Kebab", ingredients: ["Lamb & chicken skewers", "Grilled vegetables", "Rice", "Garlic yoghurt"], steps: ["Skewer marinated meats", "Grill meats & vegetables", "Serve over rice with yoghurt"] },
  { id: "tr1", type: "meal", name: "Adana Kebab", cuisine: "Turkish", tags: ["halal", "spicy"], cal: 580, p: 36, c: 20, f: 38, img: "🍢", wiki: "Adana kebab", ingredients: ["Ground lamb", "Chili flakes", "Sumac onions", "Flatbread"], steps: ["Mix spiced ground lamb", "Shape onto skewers, grill", "Serve with flatbread & onions"] },
  { id: "tr3", type: "meal", name: "Lahmacun", cuisine: "Turkish", tags: ["halal"], cal: 420, p: 20, c: 48, f: 16, img: "🫓", wiki: "Lahmacun", ingredients: ["Thin dough", "Minced lamb", "Tomato & pepper", "Parsley"], steps: ["Spread minced lamb mixture on dough", "Bake until crisp", "Top with parsley & lemon"] },
  // ---- Beverages ----
  { id: "bv1", type: "beverage", name: "Teh Tarik", cuisine: "Malaysian", tags: ["vegetarian"], cal: 180, p: 4, c: 30, f: 6, img: "🥤", wiki: "Teh tarik", ingredients: ["Black tea", "Condensed milk", "Evaporated milk"], steps: ["Brew strong black tea", "Add condensed milk", "'Pull' between cups until frothy"] },
  { id: "bv2", type: "beverage", name: "Matcha Latte", cuisine: "Japanese", tags: ["vegetarian"], cal: 150, p: 6, c: 20, f: 5, img: "🍵", wiki: "Matcha", ingredients: ["Matcha powder", "Steamed milk", "Honey"], steps: ["Whisk matcha with hot water", "Steam milk until frothy", "Combine and sweeten to taste"] },
  { id: "bv3", type: "beverage", name: "Bubble Tea", cuisine: "Chinese", tags: ["vegetarian"], cal: 320, p: 2, c: 66, f: 4, img: "🧋", wiki: "Bubble tea", ingredients: ["Black tea", "Tapioca pearls", "Milk", "Sugar syrup"], steps: ["Cook tapioca pearls", "Brew and sweeten tea", "Shake with milk, add pearls"] },
  { id: "bv4", type: "beverage", name: "Mango Lassi", cuisine: "Indian", tags: ["vegetarian", "gluten-free"], cal: 230, p: 7, c: 38, f: 6, img: "🥭", wiki: "Lassi", ingredients: ["Ripe mango", "Yogurt", "Honey", "Cardamom"], steps: ["Blend mango & yogurt smooth", "Sweeten with honey", "Chill and serve with cardamom"] },
  { id: "bv5", type: "beverage", name: "Iced Americano", cuisine: "American", tags: ["vegan", "vegetarian", "gluten-free"], cal: 15, p: 1, c: 3, f: 0, img: "☕", wiki: "Caffè Americano", ingredients: ["Espresso shots", "Cold water", "Ice"], steps: ["Pull double espresso", "Fill glass with ice", "Pour espresso over ice and water"] },
  { id: "bv6", type: "beverage", name: "Fresh Orange Juice", cuisine: "American", tags: ["vegan", "vegetarian", "gluten-free"], cal: 110, p: 2, c: 26, f: 0, img: "🍊", wiki: "Orange juice", ingredients: ["Fresh oranges"], steps: ["Halve the oranges", "Juice and strain pulp", "Serve chilled"] },
  { id: "bv7", type: "beverage", name: "Thai Iced Tea", cuisine: "Thai", tags: ["vegetarian"], cal: 200, p: 3, c: 34, f: 6, img: "🧊", wiki: "Thai tea", ingredients: ["Thai tea mix", "Condensed milk", "Evaporated milk", "Ice"], steps: ["Brew strong Thai tea", "Sweeten with condensed milk", "Pour over ice, top with milk"] },
  { id: "bv8", type: "beverage", name: "Coconut Water", cuisine: "Indonesian", tags: ["vegan", "vegetarian", "gluten-free"], cal: 60, p: 1, c: 14, f: 0, img: "🥥", wiki: "Coconut water", ingredients: ["Young coconut"], steps: ["Crack open young coconut", "Pour out the water", "Serve chilled over ice"] },
  // ---- Desserts ----
  { id: "ds1", type: "dessert", name: "Tiramisu", cuisine: "Italian", tags: ["vegetarian", "dessert"], cal: 420, p: 6, c: 40, f: 26, img: "🍰", wiki: "Tiramisu", ingredients: ["Ladyfingers", "Espresso", "Mascarpone", "Cocoa powder"], steps: ["Dip ladyfingers in espresso", "Layer with mascarpone cream", "Chill, dust with cocoa"] },
  { id: "ds2", type: "dessert", name: "Chocolate Lava Cake", cuisine: "French", tags: ["vegetarian", "dessert"], cal: 450, p: 6, c: 52, f: 24, img: "🍫", wiki: "Molten chocolate cake", ingredients: ["Dark chocolate", "Butter", "Eggs", "Flour"], steps: ["Melt chocolate & butter", "Fold in egg & flour", "Bake hot until edges set, center molten"] },
  { id: "ds3", type: "dessert", name: "New York Cheesecake", cuisine: "American", tags: ["vegetarian", "dessert"], cal: 470, p: 8, c: 44, f: 30, img: "🍰", wiki: "Cheesecake", ingredients: ["Cream cheese", "Graham cracker crust", "Sugar", "Eggs"], steps: ["Press crumb crust into pan", "Beat filling until smooth", "Bake low & slow, chill overnight"] },
  { id: "ds4", type: "dessert", name: "Gelato", cuisine: "Italian", tags: ["vegetarian", "dessert"], cal: 250, p: 5, c: 34, f: 10, img: "🍨", wiki: "Gelato", ingredients: ["Milk", "Sugar", "Cream", "Flavouring"], steps: ["Heat milk, sugar & cream", "Churn until thick", "Freeze to finish"] },
  { id: "ds5", type: "dessert", name: "Churros", cuisine: "Spanish", tags: ["vegetarian", "dessert"], cal: 380, p: 5, c: 48, f: 18, img: "🥖", wiki: "Churro", ingredients: ["Choux-style dough", "Cinnamon sugar", "Chocolate sauce"], steps: ["Pipe dough into hot oil", "Fry until golden", "Toss in cinnamon sugar, serve with chocolate"] },
  { id: "ds6", type: "dessert", name: "Crème Brûlée", cuisine: "French", tags: ["vegetarian", "gluten-free", "dessert"], cal: 380, p: 6, c: 30, f: 26, img: "🍮", wiki: "Crème brûlée", ingredients: ["Egg yolks", "Cream", "Vanilla", "Sugar"], steps: ["Whisk yolks, cream & vanilla", "Bake in water bath until set", "Torch sugar topping until crisp"] },
  { id: "ds7", type: "dessert", name: "Mochi Ice Cream", cuisine: "Japanese", tags: ["vegetarian", "gluten-free", "dessert"], cal: 210, p: 3, c: 34, f: 7, img: "🍡", wiki: "Mochi", ingredients: ["Glutinous rice flour", "Ice cream", "Cornstarch"], steps: ["Steam and knead mochi dough", "Wrap around ice cream balls", "Freeze until firm"] },
  { id: "ds8", type: "dessert", name: "Ice Kacang", cuisine: "Malaysian", tags: ["vegetarian", "dessert"], cal: 320, p: 4, c: 66, f: 6, img: "🍧", wiki: "Ais kacang", ingredients: ["Shaved ice", "Red beans", "Palm sugar syrup", "Condensed milk"], steps: ["Shave ice into a mound", "Add beans & sweet toppings", "Drizzle with syrup and milk"] },
  { id: "ds9", type: "dessert", name: "Baklava", cuisine: "Turkish", tags: ["vegetarian", "dessert"], cal: 330, p: 5, c: 40, f: 18, img: "🍯", wiki: "Baklava", ingredients: ["Filo pastry", "Chopped pistachios", "Butter", "Honey syrup"], steps: ["Layer buttered filo & nuts", "Bake until golden & crisp", "Soak in honey syrup"] },
  { id: "th4", type: "dessert", name: "Mango Sticky Rice", cuisine: "Thai", tags: ["vegetarian", "dessert"], cal: 420, p: 6, c: 78, f: 10, img: "🥭", wiki: "Mango sticky rice", ingredients: ["Sticky rice", "Mango", "Coconut milk", "Palm sugar"], steps: ["Steam sticky rice", "Warm sweetened coconut milk", "Serve with sliced mango"] },
  { id: "ds10", type: "dessert", name: "Apple Pie", cuisine: "American", tags: ["vegetarian", "dessert"], cal: 410, p: 4, c: 58, f: 18, img: "🥧", wiki: "Apple pie", ingredients: ["Pie crust", "Apples", "Cinnamon", "Sugar"], steps: ["Toss sliced apples with sugar & spice", "Fill pie crust, top with lattice", "Bake until golden and bubbling"] },
  { id: "ds11", type: "dessert", name: "Glazed Doughnut", cuisine: "American", tags: ["vegetarian", "dessert"], cal: 300, p: 4, c: 34, f: 16, img: "🍩", wiki: "Doughnut", ingredients: ["Yeasted dough", "Oil for frying", "Sugar glaze"], steps: ["Proof and shape dough rings", "Fry until golden on both sides", "Dip in glaze while warm"] },
  { id: "ds12", type: "dessert", name: "Belgian Waffles", cuisine: "American", tags: ["vegetarian", "dessert"], cal: 430, p: 8, c: 56, f: 18, img: "🧇", wiki: "Belgian waffle", ingredients: ["Waffle batter", "Whipped cream", "Berries", "Maple syrup"], steps: ["Cook batter in a waffle iron", "Top with cream and berries", "Drizzle with syrup"] },
  { id: "ds13", type: "dessert", name: "Key Lime Pie", cuisine: "American", tags: ["vegetarian", "dessert"], cal: 420, p: 6, c: 54, f: 20, img: "🥧", wiki: "Key lime pie", ingredients: ["Graham cracker crust", "Key lime juice", "Condensed milk", "Egg yolks"], steps: ["Whisk filling until smooth", "Pour into crust, bake briefly", "Chill fully before slicing"] },
  // ---- Snacks ----
  { id: "sn1", type: "snack", name: "French Fries", cuisine: "American", tags: ["vegan", "vegetarian"], cal: 365, p: 4, c: 48, f: 18, img: "🍟", wiki: "French fries", ingredients: ["Potatoes", "Oil", "Salt"], steps: ["Cut potatoes into strips", "Double-fry until crisp", "Season with salt"] },
  { id: "sn2", type: "snack", name: "Chicken Nuggets", cuisine: "American", tags: [], cal: 420, p: 20, c: 28, f: 26, img: "🍗", wiki: "Chicken nugget", ingredients: ["Chicken breast", "Breadcrumbs", "Egg wash"], steps: ["Cut & bread chicken pieces", "Fry or bake until golden", "Serve with dipping sauce"] },
  { id: "sn3", type: "snack", name: "Popcorn", cuisine: "American", tags: ["vegan", "vegetarian", "gluten-free"], cal: 150, p: 3, c: 18, f: 8, img: "🍿", wiki: "Popcorn", ingredients: ["Popcorn kernels", "Oil", "Butter", "Salt"], steps: ["Heat oil in a pot", "Pop kernels covered", "Toss with butter and salt"] },
  { id: "sn4", type: "snack", name: "Spring Onion Pancake", cuisine: "Chinese", tags: ["vegetarian"], cal: 310, p: 6, c: 40, f: 14, img: "🥞", wiki: "Cong you bing", ingredients: ["Flour dough", "Spring onions", "Sesame oil"], steps: ["Roll dough with oil & onions", "Coil and flatten", "Pan-fry until crisp layers form"] },
  { id: "sn5", type: "snack", name: "Vegetable Samosa", cuisine: "Indian", tags: ["vegan", "vegetarian"], cal: 260, p: 6, c: 30, f: 14, img: "🥟", wiki: "Samosa", ingredients: ["Pastry dough", "Spiced potatoes & peas", "Cumin"], steps: ["Prepare spiced potato filling", "Fold pastry into cones, fill", "Deep fry until golden"] },
  { id: "sn6", type: "snack", name: "Edamame", cuisine: "Japanese", tags: ["vegan", "vegetarian", "gluten-free"], cal: 190, p: 17, c: 14, f: 8, img: "🫛", wiki: "Edamame", ingredients: ["Soybean pods", "Sea salt"], steps: ["Boil pods in salted water", "Drain well", "Toss with extra salt, serve warm"] },
  { id: "sn7", type: "snack", name: "Greek Yogurt Parfait", cuisine: "Greek", tags: ["vegetarian", "gluten-free"], cal: 280, p: 16, c: 36, f: 8, img: "🍓", wiki: "Parfait (food)", ingredients: ["Greek yogurt", "Granola", "Honey", "Berries"], steps: ["Layer yogurt and granola", "Add fresh berries", "Drizzle with honey"] },
  { id: "sn8", type: "snack", name: "Potato Chips", cuisine: "American", tags: ["vegan", "vegetarian", "gluten-free"], cal: 280, p: 3, c: 28, f: 18, img: "🥔", wiki: "Potato chip", ingredients: ["Potatoes", "Oil", "Salt"], steps: ["Slice potatoes paper-thin", "Fry until crisp", "Season with salt while hot"] },
  { id: "sn9", type: "snack", name: "Classic Hot Dog", cuisine: "American", tags: [], cal: 340, p: 12, c: 28, f: 20, img: "🌭", wiki: "Hot dog", ingredients: ["Sausage", "Bun", "Mustard", "Onion"], steps: ["Grill or boil the sausage", "Toast the bun", "Dress with mustard & onion"] },
  { id: "sn10", type: "snack", name: "Loaded Nachos", cuisine: "Mexican", tags: ["vegetarian"], cal: 620, p: 18, c: 58, f: 36, img: "🧀", wiki: "Nachos", ingredients: ["Tortilla chips", "Melted cheese", "Jalapeños", "Sour cream"], steps: ["Layer chips with cheese", "Bake until melted", "Top with jalapeños & sour cream"] },
  { id: "sn11", type: "snack", name: "Guacamole & Chips", cuisine: "Mexican", tags: ["vegan", "vegetarian"], cal: 420, p: 6, c: 40, f: 26, img: "🥑", wiki: "Guacamole", ingredients: ["Avocado", "Lime", "Onion", "Tortilla chips"], steps: ["Mash avocado with lime juice", "Mix in onion, chili & cilantro", "Serve with tortilla chips"] },
  { id: "sn12", type: "snack", name: "Soft Pretzel", cuisine: "German", tags: ["vegetarian"], cal: 340, p: 10, c: 64, f: 6, img: "🥨", wiki: "Pretzel", ingredients: ["Dough", "Baking soda bath", "Coarse salt"], steps: ["Shape dough into pretzels", "Dip in baking soda solution", "Bake until deep golden"] },
  { id: "sn13", type: "snack", name: "Steamed Bao Buns", cuisine: "Chinese", tags: [], cal: 280, p: 10, c: 44, f: 7, img: "🥟", wiki: "Baozi", ingredients: ["Steamed bun dough", "Pork filling", "Scallions"], steps: ["Prepare filling", "Fold dough around filling", "Steam until fluffy"] },
  { id: "sn14", type: "snack", name: "Onion Bhaji", cuisine: "Indian", tags: ["vegan", "vegetarian"], cal: 240, p: 5, c: 26, f: 13, img: "🧅", wiki: "Bhaji", ingredients: ["Sliced onions", "Chickpea flour", "Spices", "Oil"], steps: ["Coat onions in spiced batter", "Fry spoonfuls until crisp", "Drain and serve hot"] },
];
const CUISINES = ["All", ...Array.from(new Set(CATALOG.map((c) => c.cuisine)))];
const TYPES = [
  { key: "all", label: "all", icon: Utensils },
  { key: "meal", label: "meals", icon: UtensilsCrossed },
  { key: "beverage", label: "beverages", icon: Coffee },
  { key: "dessert", label: "desserts", icon: IceCream },
  { key: "snack", label: "snacks", icon: Cookie },
];

/* ================================================================== */
/* Live real-life photo lookup (Wikipedia/Wikimedia — no key needed)    */
/* Two-step fallback: high-res pageimages API, then REST summary.       */
/* ================================================================== */
const imageCache = {};
async function fetchWikiImage(title) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=640&redirects=1&titles=${encodeURIComponent(title)}`;
    const r = await fetch(url);
    if (r.ok) {
      const data = await r.json();
      const pages = data.query && data.query.pages;
      if (pages) {
        const page = Object.values(pages)[0];
        if (page && page.thumbnail && page.thumbnail.source) return page.thumbnail.source;
      }
    }
  } catch (e) { /* fall through */ }
  try {
    const r2 = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (r2.ok) {
      const data2 = await r2.json();
      const src = (data2.thumbnail && data2.thumbnail.source) || (data2.originalimage && data2.originalimage.source);
      if (src) return src;
    }
  } catch (e) { /* fall through */ }
  return null;
}
function useDishImage(title) {
  const [url, setUrl] = useState(imageCache[title] && imageCache[title] !== "error" ? imageCache[title] : null);
  useEffect(() => {
    if (!title) return;
    if (imageCache[title]) { setUrl(imageCache[title] !== "error" ? imageCache[title] : null); return; }
    let active = true;
    fetchWikiImage(title).then((src) => {
      imageCache[title] = src || "error";
      if (active && src) setUrl(src);
    });
    return () => { active = false; };
  }, [title]);
  return url;
}
function DishImage({ dish, height = 120, radius = 16 }) {
  const url = useDishImage(dish.wiki);
  const [broke, setBroke] = useState(false);
  return (
    <div style={{
      width: "100%", height, borderRadius: radius, overflow: "hidden", position: "relative",
      background: "linear-gradient(135deg,#DCEEE4,#EAF6ED)", display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {url && !broke ? (
        <img src={url} alt={dish.name} onError={() => setBroke(true)} loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ fontSize: height * 0.36 }}>{dish.img}</span>
      )}
    </div>
  );
}

/* ================================================================== */
/* Gamification config                                                 */
/* ================================================================== */
const TITLES = [
  { level: 1, name: "Sprout" }, { level: 3, name: "Seedling" }, { level: 6, name: "Bloomer" },
  { level: 10, name: "Cultivator" }, { level: 15, name: "Harvester" }, { level: 21, name: "Nourisher" },
  { level: 28, name: "Vital Master" }, { level: 36, name: "NutriX Legend" },
];
function titleForLevel(level) {
  let t = TITLES[0];
  for (const x of TITLES) if (level >= x.level) t = x;
  return t.name;
}
function xpForLevel(level) { return 100 + (level - 1) * 40; }

const BADGES = [
  { id: "first_log", name: "First Bite", emoji: "🍽️", tier: "common", metric: "totalLogs", goal: 1, desc: "Log your first meal" },
  { id: "photo_pro", name: "Photo Pro", emoji: "📸", tier: "common", metric: "photoLogs", goal: 5, desc: "Log 5 meals by photo" },
  { id: "streak3", name: "3-Day Streak", emoji: "🔥", tier: "rare", metric: "streak", goal: 3, desc: "Log 3 days in a row" },
  { id: "streak7", name: "Week Warrior", emoji: "🗓️", tier: "rare", metric: "streak", goal: 7, desc: "Log 7 days in a row" },
  { id: "sweet_tooth", name: "Sweet Tooth", emoji: "🍰", tier: "rare", metric: "dessertLogs", goal: 5, desc: "Log 5 desserts from the catalog" },
  { id: "snack_attack", name: "Snack Attack", emoji: "🍿", tier: "rare", metric: "snackLogs", goal: 5, desc: "Log 5 snacks from the catalog" },
  { id: "thirst_quencher", name: "Thirst Quencher", emoji: "🥤", tier: "rare", metric: "beverageLogs", goal: 5, desc: "Log 5 beverages from the catalog" },
  { id: "hydro", name: "Hydration Hero", emoji: "💧", tier: "epic", metric: "hydrationHits", goal: 1, desc: "Hit your water goal once" },
  { id: "explorer", name: "Cuisine Explorer", emoji: "🧭", tier: "epic", metric: "cuisinesTried", goal: 5, desc: "Try 5 different cuisines" },
  { id: "half_century", name: "Half Century", emoji: "🥈", tier: "epic", metric: "totalLogs", goal: 50, desc: "Log 50 meals total" },
  { id: "streak30", name: "Habit Legend", emoji: "🏅", tier: "legendary", metric: "streak", goal: 30, desc: "Log 30 days in a row" },
  { id: "level10", name: "Cultivator Rank", emoji: "🌿", tier: "legendary", metric: "level", goal: 10, desc: "Reach level 10" },
  { id: "globetrotter", name: "Globetrotter", emoji: "🌍", tier: "legendary", metric: "cuisinesTried", goal: 10, desc: "Try 10 different cuisines" },
  { id: "century", name: "Century Club", emoji: "💯", tier: "legendary", metric: "totalLogs", goal: 100, desc: "Log 100 meals total" },
  { id: "mythic_master", name: "NutriX Mythic", emoji: "✨", tier: "mythic", metric: "level", goal: 20, desc: "Reach level 20 — a true NutriX master" },
];
const TIER_COLOR = { common: "#7FA192", rare: "#4A90D9", epic: "#9B6FD9", legendary: "#D9A441", mythic: "#E85D9C" };
const TIER_LABEL = { common: "Common", rare: "Rare", epic: "Epic", legendary: "Legendary", mythic: "Mythic" };
const TIER_XP_BONUS = { common: 10, rare: 20, epic: 35, legendary: 60, mythic: 120 };

/* ================================================================== */
/* Nutrition math                                                      */
/* ================================================================== */
const ACTIVITY_MULT = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
function computeGoals(p) {
  const w = Number(p.weight), h = Number(p.height), a = Number(p.age);
  let bmr = 10 * w + 6.25 * h - 5 * a + (p.gender === "male" ? 5 : -161);
  const tdee = bmr * ACTIVITY_MULT[p.activityLevel];
  let calorieGoal = tdee;
  if (p.goal === "lose") calorieGoal = tdee - 500;
  if (p.goal === "gain") calorieGoal = tdee + 500;
  calorieGoal = Math.max(1200, Math.round(calorieGoal));
  const proteinG = Math.round((calorieGoal * 0.3) / 4);
  const carbsG = Math.round((calorieGoal * 0.4) / 4);
  const fatG = Math.round((calorieGoal * 0.3) / 9);
  const waterGoalMl = Math.round(w * 35);
  return { calorieGoal, proteinG, carbsG, fatG, waterGoalMl };
}

/* ================================================================== */
/* Real cross-device account data, backed by Supabase (a real database). */
/* Signing in on a new phone pulls the same data down from the cloud.    */
/* Dark-mode preference stays in localStorage — that's a per-device UI   */
/* setting, not account data, so it's fine to keep it simple.            */
/* ================================================================== */
function getLocalPref(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function setLocalPref(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
}

async function fetchAppData(userId) {
  try {
    const { data, error } = await supabase.from("app_data").select("data").eq("user_id", userId).single();
    if (error || !data) return null;
    return data.data;
  } catch (e) { return null; }
}
async function saveAppData(userId, blob) {
  try {
    await supabase.from("app_data").upsert({ user_id: userId, data: blob, updated_at: new Date().toISOString() });
    return true;
  } catch (e) { return false; }
}
async function deleteAppData(userId) {
  try { await supabase.from("app_data").delete().eq("user_id", userId); return true; }
  catch (e) { return false; }
}

/* ================================================================== */
/* Small UI atoms                                                      */
/* ================================================================== */
function Ring({ value, max, size = 96, stroke = 10, color, bg = "var(--track)", children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, max > 0 ? value / max : 0);
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={bg} strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
}
function Confetti({ show }) {
  const pieces = useMemo(() => Array.from({ length: 46 }).map((_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 0.4, dur: 1.6 + Math.random() * 1.3,
    color: ["#1F9D6C", "#F2994A", "#4A90D9", "#9B6FD9", "#D9A441", "#E85D9C"][i % 6], rot: Math.random() * 360,
  })), [show]);
  if (!show) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 90, overflow: "hidden" }}>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.left}%`, top: "-10px", width: 8, height: 12, background: p.color,
          transform: `rotate(${p.rot}deg)`, animation: `nutrix-fall ${p.dur}s ${p.delay}s ease-in forwards`, borderRadius: 2,
        }} />
      ))}
    </div>
  );
}
async function callClaude({ system, messages, maxTokens = 1000 }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: maxTokens, system, messages }),
  });
  const data = await res.json();
  return (data.content || []).map((b) => b.text || "").join("\n");
}

/* ================================================================== */
/* Main App                                                             */
/* ================================================================== */
const emptyAccountState = (name) => ({
  profile: { name: name || "", age: 27, gender: "male", height: 170, weight: 65, activityLevel: "moderate", goal: "maintain" },
  goals: null, todayLog: [], water: 0, xp: 0, level: 1, streak: 1, totalLogs: 0, photoLogs: 0,
  hydrationHits: 0, dessertLogs: 0, snackLogs: 0, beverageLogs: 0, cuisinesTried: [], unlockedBadges: [],
  weightHistory: [], onboarded: false,
});

export default function NutriXApp() {
  const [lang, setLang] = useState("en");
  const t = STRINGS[lang];
  const [darkMode, setDarkMode] = useState(false);
  const [booting, setBooting] = useState(true);

  const [currentUser, setCurrentUser] = useState(null); // email, for display only
  const [userId, setUserId] = useState(null); // Supabase auth user id — the real account key
  const [stage, setStage] = useState("auth");
  const [tab, setTab] = useState("home");
  const [catalogTypeFilter, setCatalogTypeFilter] = useState("all");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [profile, setProfile] = useState(emptyAccountState().profile);
  const [goals, setGoals] = useState(null);
  const [todayLog, setTodayLog] = useState([]);
  const [water, setWater] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [photoLogs, setPhotoLogs] = useState(0);
  const [hydrationHits, setHydrationHits] = useState(0);
  const [dessertLogs, setDessertLogs] = useState(0);
  const [snackLogs, setSnackLogs] = useState(0);
  const [beverageLogs, setBeverageLogs] = useState(0);
  const [cuisinesTried, setCuisinesTried] = useState(new Set());
  const [unlockedBadges, setUnlockedBadges] = useState(new Set());
  const [weightHistory, setWeightHistory] = useState([]);

  const [confetti, setConfetti] = useState(false);
  const [toastQueue, setToastQueue] = useState([]);
  const [celebrationQueue, setCelebrationQueue] = useState([]);
  const [addModal, setAddModal] = useState(null);
  const [dishDetail, setDishDetail] = useState(null);
  const [motivIdx] = useState(() => Math.floor(Math.random() * 4));

  const totals = useMemo(() => todayLog.reduce((acc, m) => ({
    cal: acc.cal + m.cal, p: acc.p + m.p, c: acc.c + m.c, f: acc.f + m.f,
  }), { cal: 0, p: 0, c: 0, f: 0 }), [todayLog]);

  // ---- on open: check Supabase for a real, already-logged-in session ----
  // (Supabase keeps the session token itself — this works across devices as long
  // as you log in with the same email/password on each one.)
  useEffect(() => {
    (async () => {
      const dm = getLocalPref("settings:darkMode");
      if (dm !== null) setDarkMode(dm === "true");

      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData && sessionData.session;
      if (session && session.user) {
        setCurrentUser(session.user.email);
        setUserId(session.user.id);
        const blob = await fetchAppData(session.user.id);
        if (blob) {
          loadAccountIntoState(blob);
          setStage(blob.onboarded ? "main" : "onboarding");
        } else {
          // logged in but no saved data yet (shouldn't normally happen) — start fresh
          const fresh = emptyAccountState(session.user.email);
          loadAccountIntoState(fresh);
          setStage("onboarding");
        }
      }
      setBooting(false);
    })();
  }, []); // eslint-disable-line

  function showToast(title, sub) {
    setToastQueue((q) => [...q, { id: Date.now() + Math.random(), title, sub }]);
  }
  useEffect(() => {
    if (toastQueue.length === 0) return;
    const timer = setTimeout(() => setToastQueue((q) => q.slice(1)), 2400);
    return () => clearTimeout(timer);
  }, [toastQueue]);

  function pushCelebration(item) { setCelebrationQueue((q) => [...q, item]); }

  function grantXP(amount) {
    setXp((prevXp) => {
      let newXp = prevXp + amount;
      setLevel((prevLevel) => {
        let lvl = prevLevel, need = xpForLevel(lvl), leveled = false;
        while (newXp >= need) { newXp -= need; lvl += 1; need = xpForLevel(lvl); leveled = true; }
        if (leveled) {
          setConfetti(true); setTimeout(() => setConfetti(false), 2200);
          pushCelebration({ kind: "level", level: lvl, title: titleForLevel(lvl) });
        }
        return lvl;
      });
      return newXp;
    });
  }

  function checkBadges(stateOverride = {}) {
    const state = { totalLogs, photoLogs, streak, hydrationHits, level, dessertLogs, snackLogs, beverageLogs, cuisinesTried: cuisinesTried.size, ...stateOverride };
    BADGES.forEach((b) => {
      if (!unlockedBadges.has(b.id) && (state[b.metric] || 0) >= b.goal) {
        setUnlockedBadges((prev) => new Set(prev).add(b.id));
        setConfetti(true); setTimeout(() => setConfetti(false), 2200);
        const bonus = TIER_XP_BONUS[b.tier] || 10;
        grantXP(bonus);
        pushCelebration({ kind: "badge", badge: b, bonus });
      }
    });
  }

  function addFoodToLog(food, source) {
    const entry = { id: Date.now() + Math.random(), ...food, source, time: new Date() };
    setTodayLog((l) => [entry, ...l]);
    const newTotalLogs = totalLogs + 1; setTotalLogs(newTotalLogs);
    const newPhotoLogs = source === "photo" ? photoLogs + 1 : photoLogs;
    if (source === "photo") setPhotoLogs(newPhotoLogs);
    let newDessert = dessertLogs, newSnack = snackLogs, newBeverage = beverageLogs;
    if (source === "catalog" && food.type === "dessert") { newDessert += 1; setDessertLogs(newDessert); }
    if (source === "catalog" && food.type === "snack") { newSnack += 1; setSnackLogs(newSnack); }
    if (source === "catalog" && food.type === "beverage") { newBeverage += 1; setBeverageLogs(newBeverage); }
    let newCuisines = cuisinesTried;
    if (food.cuisine) { newCuisines = new Set(cuisinesTried); newCuisines.add(food.cuisine); setCuisinesTried(newCuisines); }
    const xpGain = source === "photo" ? 15 : source === "catalog" ? 10 : 8;
    grantXP(xpGain);
    showToast(`+${xpGain} ${t.xpGained}`, food.name);
    setTimeout(() => checkBadges({
      totalLogs: newTotalLogs, photoLogs: newPhotoLogs, cuisinesTried: newCuisines.size,
      dessertLogs: newDessert, snackLogs: newSnack, beverageLogs: newBeverage,
    }), 50);
  }

  function addWater(ml) {
    setWater((w) => {
      const nw = w + ml;
      if (goals && nw >= goals.waterGoalMl && w < goals.waterGoalMl) {
        setHydrationHits((h) => { const nh = h + 1; setTimeout(() => checkBadges({ hydrationHits: nh }), 50); return nh; });
      }
      return nw;
    });
  }

  function loadAccountIntoState(acc) {
    setProfile(acc.profile); setGoals(acc.goals); setTodayLog(acc.todayLog || []); setWater(acc.water || 0);
    setXp(acc.xp || 0); setLevel(acc.level || 1); setStreak(acc.streak || 1); setTotalLogs(acc.totalLogs || 0);
    setPhotoLogs(acc.photoLogs || 0); setHydrationHits(acc.hydrationHits || 0);
    setDessertLogs(acc.dessertLogs || 0); setSnackLogs(acc.snackLogs || 0); setBeverageLogs(acc.beverageLogs || 0);
    setCuisinesTried(new Set(acc.cuisinesTried || [])); setUnlockedBadges(new Set(acc.unlockedBadges || []));
    setWeightHistory(acc.weightHistory || []);
  }

  async function handleAuth({ mode, name, email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email: cleanEmail, password });
      if (error || !data.user) return { ok: false, message: error ? error.message : "Sign up failed." };
      const blob = emptyAccountState(name);
      await saveAppData(data.user.id, blob);
      setCurrentUser(cleanEmail);
      setUserId(data.user.id);
      loadAccountIntoState(blob);
      setStage("onboarding");
      return { ok: true };
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error || !data.user) return { ok: false, message: error ? error.message : "Log in failed." };
      const blob = await fetchAppData(data.user.id);
      const finalBlob = blob || emptyAccountState(name);
      setCurrentUser(cleanEmail);
      setUserId(data.user.id);
      loadAccountIntoState(finalBlob);
      setStage(finalBlob.onboarded ? "main" : "onboarding");
      return { ok: true };
    }
  }

  function finishOnboarding() {
    const g = computeGoals(profile);
    setGoals(g);
    setWeightHistory([{ date: "Today", weight: Number(profile.weight) }]);
    setStage("main");
  }

  async function logOut() {
    await supabase.auth.signOut();
    setCurrentUser(null); setUserId(null); setStage("auth"); setTab("home");
  }

  async function deleteAccountData() {
    if (!userId) return;
    await deleteAppData(userId);
    await supabase.auth.signOut();
    setCurrentUser(null); setUserId(null); setStage("auth"); setTab("home"); setSettingsOpen(false);
  }

  function toggleDarkMode() {
    setDarkMode((d) => { const nd = !d; setLocalPref("settings:darkMode", String(nd)); return nd; });
  }

  // save the logged-in user's live state to the real database on every change
  useEffect(() => {
    if (!userId || booting) return;
    const blob = {
      profile, goals, todayLog, water, xp, level, streak, totalLogs, photoLogs, hydrationHits,
      dessertLogs, snackLogs, beverageLogs, cuisinesTried: Array.from(cuisinesTried),
      unlockedBadges: Array.from(unlockedBadges), weightHistory, onboarded: stage === "main",
    };
    saveAppData(userId, blob);
  }, [profile, goals, todayLog, water, xp, level, streak, totalLogs, photoLogs, hydrationHits, dessertLogs, snackLogs, beverageLogs, cuisinesTried, unlockedBadges, weightHistory, stage]); // eslint-disable-line

  useEffect(() => { if (stage === "main") checkBadges({ streak: 1 }); }, [stage]); // eslint-disable-line

  function goToCatalog(typeKey) { setCatalogTypeFilter(typeKey); setTab("catalog"); }

  if (booting) {
    return (
      <div data-theme={darkMode ? "dark" : "light"} style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, fontFamily: "Inter, sans-serif" }}>
        <GlobalStyle />
        <Sparkles size={30} color="#1F9D6C" />
        <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} color="#1F9D6C" />
      </div>
    );
  }

  if (stage === "auth") return <AuthScreen t={t} lang={lang} setLang={setLang} onAuth={handleAuth} darkMode={darkMode} />;
  if (stage === "onboarding") return <Onboarding profile={profile} setProfile={setProfile} t={t} lang={lang} setLang={setLang} onDone={finishOnboarding} darkMode={darkMode} />;

  return (
    <div data-theme={darkMode ? "dark" : "light"} style={{ fontFamily: "Inter, sans-serif", background: "var(--bg)", minHeight: "100%", color: "var(--text-strong)" }}>
      <GlobalStyle />
      <Confetti show={confetti} />
      {toastQueue[0] && <Toast toast={toastQueue[0]} />}
      {celebrationQueue[0] && (
        <CelebrationModal t={t} item={celebrationQueue[0]} onDismiss={() => setCelebrationQueue((q) => q.slice(1))} />
      )}
      <TopBar t={t} lang={lang} setLang={setLang} level={level} title={titleForLevel(level)} name={profile.name}
        darkMode={darkMode} onToggleDark={toggleDarkMode} />
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 90px" }}>
        <div key={tab} className="nutrix-card">
          {tab === "home" && (
            <HomeTab t={t} goals={goals} totals={totals} water={water} addWater={addWater} streak={streak} xp={xp}
              level={level} todayLog={todayLog} motiv={t.motivational[motivIdx]} onAdd={() => setTab("log")}
              onSelectDish={(d) => setDishDetail(d)} onBrowseType={goToCatalog} />
          )}
          {tab === "log" && (
            <LogTab t={t} onManual={() => setAddModal("manual")} onPhoto={() => setAddModal("photo")}
              onCatalog={() => goToCatalog("all")} todayLog={todayLog} />
          )}
          {tab === "catalog" && (
            <CatalogTab t={t} onSelect={(d) => setDishDetail(d)} typeFilter={catalogTypeFilter} setTypeFilter={setCatalogTypeFilter} />
          )}
          {tab === "coach" && <CoachTab t={t} profile={profile} goals={goals} todayLog={todayLog} totals={totals} />}
          {tab === "profile" && (
            <ProfileTab t={t} profile={profile} goals={goals} level={level} xp={xp} streak={streak}
              unlockedBadges={unlockedBadges} weightHistory={weightHistory}
              onOpenSettings={() => setSettingsOpen(true)}
              onLogWeight={(w) => setWeightHistory((h) => [...h, { date: `Day ${h.length + 1}`, weight: w }])}
              stats={{ totalLogs, photoLogs, streak, hydrationHits, level, dessertLogs, snackLogs, beverageLogs, cuisinesTried: cuisinesTried.size }} />
          )}
        </div>
      </div>
      <BottomNav t={t} tab={tab} setTab={setTab} />
      {addModal === "manual" && (
        <ManualEntryModal t={t} onClose={() => setAddModal(null)} onAdd={(food) => { addFoodToLog(food, "manual"); setAddModal(null); }} />
      )}
      {addModal === "photo" && (
        <PhotoEntryModal t={t} onClose={() => setAddModal(null)} onAdd={(food) => { addFoodToLog(food, "photo"); setAddModal(null); }} />
      )}
      {dishDetail && (
        <DishModal t={t} dish={dishDetail} onClose={() => setDishDetail(null)}
          onAdd={() => { addFoodToLog({ name: dishDetail.name, cal: dishDetail.cal, p: dishDetail.p, c: dishDetail.c, f: dishDetail.f, cuisine: dishDetail.cuisine, type: dishDetail.type }, "catalog"); setDishDetail(null); }} />
      )}
      {settingsOpen && (
        <SettingsModal t={t} lang={lang} setLang={setLang} darkMode={darkMode} onToggleDark={toggleDarkMode}
          email={currentUser} onClose={() => setSettingsOpen(false)} onLogOut={logOut} onDeleteAccount={deleteAccountData} />
      )}
      <Analytics />
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
      :root, [data-theme="light"] {
        --bg:#F1F8F4; --surface:#ffffff; --surface-2:#F8FBF9; --text:#123B2E; --text-strong:#16241D;
        --muted:#9AAFA6; --muted-2:#7A9086; --text-secondary:#5C7A6D; --border:#E4EFE9; --track:#EEF3F0;
        --nav-bg:rgba(255,255,255,0.92);
      }
      [data-theme="dark"] {
        --bg:#0E1A15; --surface:#17261F; --surface-2:#1C2B23; --text:#EAF3ED; --text-strong:#F2F8F5;
        --muted:#87A196; --muted-2:#87A196; --text-secondary:#A9BEB3; --border:#25382F; --track:#22322A;
        --nav-bg:rgba(14,26,21,0.92);
      }
      .nutrix-heading { font-family: 'Sora', sans-serif; }
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 0; height: 0; }
      @keyframes nutrix-fall { to { transform: translateY(100vh) rotate(400deg); opacity: 0.2; } }
      @keyframes nutrix-pop { 0% { transform: scale(0.97) translateY(4px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
      @keyframes nutrix-slide { 0% { transform: translateY(12px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      @keyframes nutrix-bounce { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); } }
      @keyframes spin { to { transform: rotate(360deg); } }
      .nutrix-card { animation: nutrix-pop 0.22s ease; }
      .nutrix-toast { animation: nutrix-slide 0.25s ease; }
      .nutrix-bounce-in { animation: nutrix-bounce 0.45s cubic-bezier(.34,1.56,.64,1); }
      .nutrix-press { transition: transform 0.12s ease, box-shadow 0.12s ease; }
      .nutrix-press:active { transform: scale(0.96); }
      .nutrix-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px; }
      input, select { color: var(--text-strong); }
      input::placeholder { color: var(--muted); }
    `}</style>
  );
}

/* ================================================================== */
/* Auth screen                                                         */
/* ================================================================== */
function AuthScreen({ t, lang, setLang, onAuth, darkMode }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!email.trim() || !password.trim() || (mode === "signup" && !name.trim())) {
      setError(t.authError); return;
    }
    setBusy(true);
    const result = await onAuth({ mode, name, email, password });
    setBusy(false);
    if (!result.ok) setError(result.message || "Something went wrong. Please try again.");
  }

  return (
    <div data-theme={darkMode ? "dark" : "light"} style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", background: "linear-gradient(160deg,#0F2F24 0%,#1F6F54 55%,#2FA876 100%)", padding: "44px 20px", color: "#fff", position: "relative", overflow: "hidden" }}>
      <GlobalStyle />
      <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(242,153,74,0.25),transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: -80, left: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle,rgba(155,111,217,0.2),transparent 70%)" }} />
      <div style={{ maxWidth: 420, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
          <LangSwitch lang={lang} setLang={setLang} light />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={24} />
          </div>
          <span className="nutrix-heading" style={{ fontSize: 26, fontWeight: 700 }}>{t.appName}</span>
        </div>
        <p style={{ opacity: 0.85, marginBottom: 32, fontSize: 15 }}>{t.tagline}</p>

        <h1 className="nutrix-heading" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
          {mode === "login" ? t.welcomeBack : t.createAccount}
        </h1>
        <p style={{ opacity: 0.75, fontSize: 13.5, marginBottom: 22 }}>{mode === "login" ? t.loginSub : t.signupSub}</p>

        <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <Field label={t.fullName}><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Amir" style={authInput} /></Field>
          )}
          <Field label={t.email}>
            <div style={{ position: "relative" }}>
              <Mail size={15} style={{ position: "absolute", left: 11, top: 12, opacity: 0.6 }} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ ...authInput, paddingLeft: 32 }} />
            </div>
          </Field>
          <Field label={t.password}>
            <div style={{ position: "relative" }}>
              <KeyRound size={15} style={{ position: "absolute", left: 11, top: 12, opacity: 0.6 }} />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPw ? "text" : "password"} placeholder="••••••••" style={{ ...authInput, paddingLeft: 32, paddingRight: 32 }} onKeyDown={(e) => e.key === "Enter" && submit()} />
              <button onClick={() => setShowPw((s) => !s)} style={{ position: "absolute", right: 8, top: 8, background: "none", border: "none", cursor: "pointer", opacity: 0.7 }}>
                {showPw ? <EyeOff size={16} color="#fff" /> : <Eye size={16} color="#fff" />}
              </button>
            </div>
          </Field>
          {error && <div style={{ color: "#FFD3C4", fontSize: 12.5 }}>{error}</div>}

          <button onClick={submit} disabled={busy} className="nutrix-press" style={{
            marginTop: 4, background: "#F2994A", color: "#fff", border: "none", borderRadius: 14, padding: "14px",
            fontWeight: 700, fontSize: 15, cursor: busy ? "default" : "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8, opacity: busy ? 0.7 : 1,
          }}>
            {busy ? <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> : <>{mode === "login" ? t.loginBtn : t.signupBtn} <ArrowRight size={17} /></>}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 13 }}>
          <span style={{ opacity: 0.75 }}>{mode === "login" ? t.noAccount : t.haveAccount}</span>{" "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} style={{ background: "none", border: "none", color: "#fff", fontWeight: 700, textDecoration: "underline", cursor: "pointer", fontSize: 13 }}>
            {mode === "login" ? t.signupLink : t.loginLink}
          </button>
        </div>
      </div>
    </div>
  );
}
const authInput = {
  width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: 14, outline: "none",
};

/* ================================================================== */
/* Onboarding                                                          */
/* ================================================================== */
function Onboarding({ profile, setProfile, t, lang, setLang, onDone, darkMode }) {
  const set = (k, v) => setProfile((p) => ({ ...p, [k]: v }));
  return (
    <div data-theme={darkMode ? "dark" : "light"} style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", background: "linear-gradient(160deg,#123B2E 0%,#1F6F54 55%,#2FA876 100%)", padding: "40px 20px", color: "#fff" }}>
      <GlobalStyle />
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <LangSwitch lang={lang} setLang={setLang} light />
        </div>
        <h1 className="nutrix-heading" style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, marginTop: 10 }}>{t.onboardTitle}</h1>
        <p style={{ opacity: 0.8, fontSize: 14, marginBottom: 24 }}>{t.onboardSub}</p>

        <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label={t.name}><input value={profile.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Amir" style={authInput} /></Field>
          <div style={{ display: "flex", gap: 12 }}>
            <Field label={t.age}><input type="number" value={profile.age} onChange={(e) => set("age", e.target.value)} style={authInput} /></Field>
            <Field label={t.height}><input type="number" value={profile.height} onChange={(e) => set("height", e.target.value)} style={authInput} /></Field>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Field label={t.weight}><input type="number" value={profile.weight} onChange={(e) => set("weight", e.target.value)} style={authInput} /></Field>
            <Field label={t.gender}>
              <select value={profile.gender} onChange={(e) => set("gender", e.target.value)} style={authInput}>
                <option value="male">{t.male}</option><option value="female">{t.female}</option>
              </select>
            </Field>
          </div>
          <Field label={t.activity}>
            <select value={profile.activityLevel} onChange={(e) => set("activityLevel", e.target.value)} style={authInput}>
              <option value="sedentary">{t.sedentary}</option><option value="light">{t.light}</option>
              <option value="moderate">{t.moderate}</option><option value="active">{t.active}</option>
              <option value="veryActive">{t.veryActive}</option>
            </select>
          </Field>
          <Field label={t.goal}>
            <div style={{ display: "flex", gap: 8 }}>
              {["lose", "maintain", "gain"].map((g) => (
                <button key={g} onClick={() => set("goal", g)} className="nutrix-press" style={{
                  flex: 1, padding: "10px 8px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.25)",
                  background: profile.goal === g ? "#fff" : "transparent", color: profile.goal === g ? "#123B2E" : "#fff",
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}>{t[g]}</button>
              ))}
            </div>
          </Field>
          <button onClick={onDone} className="nutrix-press" style={{
            marginTop: 8, background: "#F2994A", color: "#fff", border: "none", borderRadius: 14, padding: "14px",
            fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>{t.startBtn} <ChevronRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, fontSize: 12.5, opacity: 0.9 }}>{label}{children}</label>;
}

/* ================================================================== */
/* Top bar / bottom nav / lang switch                                  */
/* ================================================================== */
function LangSwitch({ lang, setLang, light }) {
  return (
    <div style={{ display: "flex", background: light ? "rgba(255,255,255,0.15)" : "var(--border)", borderRadius: 999, padding: 3 }}>
      {["en", "ms"].map((l) => (
        <button key={l} onClick={() => setLang(l)} className="nutrix-press" style={{
          border: "none", padding: "4px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, cursor: "pointer",
          background: lang === l ? (light ? "#fff" : "#1F9D6C") : "transparent",
          color: lang === l ? (light ? "#123B2E" : "#fff") : (light ? "#fff" : "var(--muted-2)"),
        }}>{l.toUpperCase()}</button>
      ))}
    </div>
  );
}
function greeting(t) {
  const h = new Date().getHours();
  if (h < 12) return t.goodMorning;
  if (h < 18) return t.goodAfternoon;
  return t.goodEvening;
}
function TopBar({ t, lang, setLang, level, title, name, darkMode, onToggleDark }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "18px 16px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <div>
        <div style={{ fontSize: 11.5, color: "var(--muted-2)", fontWeight: 600 }}>{greeting(t)}{name ? `, ${name.split(" ")[0]}` : ""}</div>
        <div className="nutrix-heading" style={{ fontSize: 17, fontWeight: 700, color: "var(--text)" }}>{t.level} {level} · {title}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={onToggleDark} className="nutrix-press" style={{
          border: "none", background: "var(--border)", width: 30, height: 30, borderRadius: 999, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)",
        }}>
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <LangSwitch lang={lang} setLang={setLang} />
      </div>
    </div>
  );
}
const NAV_ITEMS = [
  { key: "home", icon: Home }, { key: "log", icon: UtensilsCrossed }, { key: "catalog", icon: BookOpen },
  { key: "coach", icon: MessageCircle }, { key: "profile", icon: User },
];
function BottomNav({ t, tab, setTab }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--nav-bg)", backdropFilter: "blur(14px)", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "center", zIndex: 40 }}>
      <div style={{ maxWidth: 480, width: "100%", display: "flex", padding: "8px 6px" }}>
        {NAV_ITEMS.map(({ key, icon: Icon }) => {
          const active = tab === key;
          return (
            <button key={key} onClick={() => setTab(key)} className="nutrix-press" style={{
              flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, padding: "6px 0", cursor: "pointer", color: active ? "#1F9D6C" : "var(--muted)",
            }}>
              <Icon size={21} strokeWidth={active ? 2.4 : 2} />
              <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500 }}>{t[key]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
function Toast({ toast }) {
  return (
    <div className="nutrix-toast" style={{
      position: "fixed", top: 14, left: "50%", transform: "translateX(-50%)", zIndex: 70, background: "#123B2E",
      color: "#fff", borderRadius: 14, padding: "10px 18px", display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)", maxWidth: 320,
    }}>
      <Trophy size={18} color="#D9A441" />
      <div>
        <div style={{ fontWeight: 700, fontSize: 13 }}>{toast.title}</div>
        {toast.sub && <div style={{ fontSize: 11.5, opacity: 0.8 }}>{toast.sub}</div>}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Celebration modal — fun full-screen achievement/level-up reveal      */
/* ================================================================== */
function CelebrationModal({ t, item, onDismiss }) {
  const isBadge = item.kind === "badge";
  const color = isBadge ? TIER_COLOR[item.badge.tier] : "#9B6FD9";
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,16,0.6)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="nutrix-bounce-in" style={{
        background: "var(--surface)", borderRadius: 28, padding: "32px 24px 24px", maxWidth: 340, width: "100%",
        textAlign: "center", boxShadow: `0 20px 60px ${color}44`, border: `2px solid ${color}55`,
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 42, background: `radial-gradient(circle,${color}33,${color}11)`,
        }}>
          {isBadge ? item.badge.emoji : "🎉"}
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>
          {isBadge ? t.newBadge : t.levelUp}
        </div>
        <h2 className="nutrix-heading" style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", margin: "0 0 6px" }}>
          {isBadge ? item.badge.name : `${t.level} ${item.level}`}
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 14px" }}>
          {isBadge ? item.badge.desc : item.title}
        </p>
        {isBadge && (
          <span style={{ display: "inline-block", fontSize: 10.5, fontWeight: 700, color, background: `${color}18`, padding: "3px 10px", borderRadius: 999, marginBottom: 14 }}>
            {TIER_LABEL[item.badge.tier]}
          </span>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 20 }}>
          <Sparkles size={14} color="#9B6FD9" />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)" }}>
            +{isBadge ? item.bonus : 0} {isBadge ? t.bonusXp : ""}
          </span>
        </div>
        <button onClick={onDismiss} className="nutrix-press" style={{
          width: "100%", border: "none", background: color, color: "#fff", borderRadius: 14, padding: "12px",
          fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>{t.continue}</button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Settings modal                                                       */
/* ================================================================== */
function SettingsModal({ t, lang, setLang, darkMode, onToggleDark, email, onClose, onLogOut, onDeleteAccount }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  return (
    <ModalShell onClose={onClose}>
      <h2 className="nutrix-heading" style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>{t.settings}</h2>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 4px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {darkMode ? <Moon size={17} color="var(--text)" /> : <Sun size={17} color="var(--text)" />}
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{t.darkMode}</span>
        </div>
        <ToggleSwitch checked={darkMode} onChange={onToggleDark} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 4px", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{t.language}</span>
        <LangSwitch lang={lang} setLang={setLang} />
      </div>

      <div style={{ padding: "12px 4px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 2 }}>{t.account}</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>{email}</div>
      </div>

      <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, padding: "12px 4px 4px" }}>{t.dataNote}</p>

      <button onClick={onLogOut} className="nutrix-press" style={{
        width: "100%", marginTop: 10, border: "none", background: "var(--track)", color: "var(--text)", borderRadius: 12,
        padding: "12px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 8,
      }}><LogOut size={15} /> {t.logOut}</button>

      {!confirmingDelete ? (
        <button onClick={() => setConfirmingDelete(true)} className="nutrix-press" style={{
          width: "100%", marginTop: 10, border: "1px solid #E0654533", background: "transparent", color: "#E06545",
          borderRadius: 12, padding: "12px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", gap: 8,
        }}><Trash2 size={15} /> {t.deleteAccount}</button>
      ) : (
        <div style={{ marginTop: 10, background: "#E0654511", borderRadius: 12, padding: 14 }}>
          <p style={{ fontSize: 12.5, color: "#B44A32", marginBottom: 10 }}>{t.deleteConfirm}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setConfirmingDelete(false)} className="nutrix-press" style={{ flex: 1, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", borderRadius: 10, padding: "9px", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>{t.nvm}</button>
            <button onClick={onDeleteAccount} className="nutrix-press" style={{ flex: 1, border: "none", background: "#E06545", color: "#fff", borderRadius: 10, padding: "9px", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>{t.yesDelete}</button>
          </div>
        </div>
      )}
      <div style={{ textAlign: "center", fontSize: 10.5, color: "var(--muted)", marginTop: 18 }}>{t.version}</div>
    </ModalShell>
  );
}
function ToggleSwitch({ checked, onChange }) {
  return (
    <button onClick={onChange} className="nutrix-press" style={{
      width: 44, height: 26, borderRadius: 999, border: "none", cursor: "pointer", position: "relative",
      background: checked ? "#1F9D6C" : "var(--border)", transition: "background 0.2s",
    }}>
      <div style={{
        position: "absolute", top: 3, left: checked ? 21 : 3, width: 20, height: 20, borderRadius: "50%",
        background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }} />
    </button>
  );
}

/* ================================================================== */
/* Home Tab                                                             */
/* ================================================================== */
function HomeTab({ t, goals, totals, water, addWater, streak, xp, level, todayLog, motiv, onAdd, onSelectDish, onBrowseType }) {
  if (!goals) return null;
  const calRemaining = Math.max(0, goals.calorieGoal - totals.cal);
  const need = xpForLevel(level);
  const trending = useMemo(() => [...CATALOG].sort(() => 0.5 - Math.random()).slice(0, 8), []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
      <div className="nutrix-card" style={{ background: "linear-gradient(135deg,#123B2E,#1F6F54)", borderRadius: 22, padding: 18, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,rgba(155,111,217,0.25),transparent 70%)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Flame size={18} color="#F2994A" /><span style={{ fontWeight: 700, fontSize: 13 }}>{streak} {t.dayStreak}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={16} color="#9B6FD9" /><span style={{ fontSize: 12, opacity: 0.9 }}>{xp}/{need} XP</span>
          </div>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 999, overflow: "hidden", position: "relative" }}>
          <div style={{ height: "100%", width: `${(xp / need) * 100}%`, background: "linear-gradient(90deg,#9B6FD9,#4A90D9)", transition: "width 0.5s" }} />
        </div>
      </div>

      <div className="nutrix-card" style={{ background: "var(--surface)", borderRadius: 22, padding: 20, boxShadow: "0 6px 20px rgba(18,59,46,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Ring value={totals.cal} max={goals.calorieGoal} size={128} stroke={12} color="#F2994A">
            <div style={{ textAlign: "center" }}>
              <div className="nutrix-heading" style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>{calRemaining}</div>
              <div style={{ fontSize: 10.5, color: "var(--muted-2)" }}>{t.calories} {t.remaining}</div>
            </div>
          </Ring>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
          <Macro label={t.protein} val={totals.p} goal={goals.proteinG} color="#4A90D9" />
          <Macro label={t.carbs} val={totals.c} goal={goals.carbsG} color="#F2994A" />
          <Macro label={t.fat} val={totals.f} goal={goals.fatG} color="#9B6FD9" />
        </div>
      </div>

      <div className="nutrix-card" style={{ background: "var(--surface)", borderRadius: 22, padding: 18, boxShadow: "0 6px 20px rgba(18,59,46,0.06)", display: "flex", alignItems: "center", gap: 16 }}>
        <Ring value={water} max={goals.waterGoalMl} size={72} stroke={8} color="#4A90D9"><Droplets size={22} color="#4A90D9" /></Ring>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{t.water}</div>
          <div style={{ fontSize: 12, color: "var(--muted-2)", marginBottom: 8 }}>{water} / {goals.waterGoalMl} {t.glOfWater}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[250, 500].map((ml) => (
              <button key={ml} onClick={() => addWater(ml)} className="nutrix-press" style={{ border: "none", background: "#4A90D91A", color: "#4A90D9", padding: "5px 10px", borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>+{ml}ml</button>
            ))}
          </div>
        </div>
      </div>

      <div className="nutrix-card" style={{ background: "linear-gradient(135deg,#FFF3E8,#FFEAD9)", borderRadius: 18, padding: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <Sparkles size={18} color="#F2994A" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 13, color: "#5C4326", lineHeight: 1.5, margin: 0 }}>{motiv}</p>
      </div>

      <div>
        <h3 className="nutrix-heading" style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>{t.browseByType}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {TYPES.filter((ty) => ty.key !== "all").map((ty) => {
            const Icon = ty.icon;
            return (
              <button key={ty.key} onClick={() => onBrowseType(ty.key)} className="nutrix-press" style={{
                border: "none", background: "var(--surface)", borderRadius: 14, padding: "12px 6px", display: "flex",
                flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: "0 4px 14px rgba(18,59,46,0.06)",
              }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#1F9D6C1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={17} color="#1F9D6C" />
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text)", textTransform: "capitalize" }}>{t[ty.label]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="nutrix-heading" style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>{t.trending}</h3>
        <div className="nutrix-scroll">
          {trending.map((d) => (
            <button key={d.id} onClick={() => onSelectDish(d)} className="nutrix-press" style={{
              flexShrink: 0, width: 118, border: "none", background: "var(--surface)", borderRadius: 16, padding: 8, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(18,59,46,0.07)", textAlign: "left",
            }}>
              <DishImage dish={d} height={80} radius={12} />
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text)", marginTop: 6, lineHeight: 1.25 }}>{d.name}</div>
              <div style={{ fontSize: 10, color: "#F2994A", fontWeight: 700 }}>{d.cal} kcal</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 className="nutrix-heading" style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{t.todaysMeals}</h3>
          <button onClick={onAdd} className="nutrix-press" style={{ border: "none", background: "none", color: "#1F9D6C", fontWeight: 700, fontSize: 12.5, display: "flex", alignItems: "center", gap: 3, cursor: "pointer" }}>
            <Plus size={14} /> {t.addMeal}
          </button>
        </div>
        {todayLog.length === 0 ? (
          <div style={{ background: "var(--surface)", borderRadius: 16, padding: 20, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>{t.noMealsYet}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{todayLog.map((m) => <MealRow key={m.id} m={m} />)}</div>
        )}
      </div>
    </div>
  );
}
function Macro({ label, val, goal, color }) {
  const pct = Math.min(100, Math.round((val / goal) * 100) || 0);
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{val}g</div>
      <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 4 }}>{label}</div>
      <div style={{ height: 4, background: "var(--track)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}
function MealRow({ m }) {
  const sourceIcon = m.source === "photo" ? <Camera size={14} /> : m.source === "catalog" ? <BookOpen size={14} /> : <Edit3 size={14} />;
  return (
    <div style={{ background: "var(--surface)", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 3px 12px rgba(18,59,46,0.05)" }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--track)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1F9D6C" }}>{sourceIcon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>{m.name}</div>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>P {m.p}g · C {m.c}g · F {m.f}g</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#F2994A" }}>{m.cal} kcal</div>
    </div>
  );
}

/* ================================================================== */
/* Log Tab                                                              */
/* ================================================================== */
function LogTab({ t, onManual, onPhoto, onCatalog, todayLog }) {
  return (
    <div style={{ paddingTop: 8, display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 className="nutrix-heading" style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{t.addMeal}</h2>
      <button onClick={onPhoto} className="nutrix-press" style={optionCard("#F2994A")}>
        <Camera size={22} color="#fff" />
        <div style={{ textAlign: "left" }}><div style={{ fontWeight: 700, fontSize: 14 }}>{t.snapPhoto}</div><div style={{ fontSize: 11.5, opacity: 0.85 }}>AI identifies dishes automatically</div></div>
      </button>
      <button onClick={onCatalog} className="nutrix-press" style={optionCard("#1F9D6C")}>
        <BookOpen size={22} color="#fff" />
        <div style={{ textAlign: "left" }}><div style={{ fontWeight: 700, fontSize: 14 }}>{t.fromCatalog}</div><div style={{ fontSize: 11.5, opacity: 0.85 }}>114 dishes & drinks, 18 cuisines</div></div>
      </button>
      <button onClick={onManual} className="nutrix-press" style={optionCard("#4A90D9")}>
        <Edit3 size={22} color="#fff" />
        <div style={{ textAlign: "left" }}><div style={{ fontWeight: 700, fontSize: 14 }}>{t.manualEntry}</div><div style={{ fontSize: 11.5, opacity: 0.85 }}>Type in your own numbers</div></div>
      </button>
      <h3 className="nutrix-heading" style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginTop: 8 }}>{t.todaysMeals}</h3>
      {todayLog.length === 0 ? (
        <div style={{ background: "var(--surface)", borderRadius: 16, padding: 20, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>{t.noMealsYet}</div>
      ) : todayLog.map((m) => <MealRow key={m.id} m={m} />)}
    </div>
  );
}
function optionCard(color) {
  return { border: "none", background: color, borderRadius: 18, padding: "16px 18px", color: "#fff", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left", boxShadow: `0 8px 20px ${color}33` };
}

/* ================================================================== */
/* Catalog Tab                                                         */
/* ================================================================== */
function CatalogTab({ t, onSelect, typeFilter, setTypeFilter }) {
  const [q, setQ] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const filtered = CATALOG.filter((d) =>
    (typeFilter === "all" || d.type === typeFilter) &&
    (cuisine === "All" || d.cuisine === cuisine) &&
    d.name.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search size={16} color="var(--muted)" style={{ position: "absolute", left: 12, top: 12 }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchCuisine}
          style={{ width: "100%", padding: "10px 12px 10px 34px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)", fontSize: 13.5, outline: "none" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginBottom: 10 }}>
        {TYPES.map((ty) => {
          const Icon = ty.icon;
          const active = typeFilter === ty.key;
          return (
            <button key={ty.key} onClick={() => setTypeFilter(ty.key)} className="nutrix-press" style={{
              border: "none", borderRadius: 12, padding: "8px 2px", display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, cursor: "pointer", background: active ? "#1F9D6C" : "var(--surface)", color: active ? "#fff" : "var(--text-secondary)",
              boxShadow: active ? "0 4px 12px rgba(31,157,108,0.3)" : "0 2px 8px rgba(18,59,46,0.05)",
            }}>
              <Icon size={15} />
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: "capitalize" }}>{t[ty.label]}</span>
            </button>
          );
        })}
      </div>
      <div className="nutrix-scroll" style={{ marginBottom: 10 }}>
        {CUISINES.map((c) => (
          <button key={c} onClick={() => setCuisine(c)} className="nutrix-press" style={{
            flexShrink: 0, border: "none", padding: "6px 13px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: cuisine === c ? "#123B2E" : "var(--border)", color: cuisine === c ? "#fff" : "var(--text-secondary)",
          }}>{c === "All" ? t.allCuisines : c}</button>
        ))}
      </div>
      <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 8 }}>{filtered.length} results</div>
      {filtered.length === 0 ? (
        <div style={{ background: "var(--surface)", borderRadius: 16, padding: 24, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>No matches — try a different filter.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {filtered.map((d) => (
            <button key={d.id} onClick={() => onSelect(d)} className="nutrix-card nutrix-press" style={{
              border: "none", background: "var(--surface)", borderRadius: 16, padding: 0, textAlign: "left", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(18,59,46,0.06)", overflow: "hidden",
            }}>
              <DishImage dish={d} height={100} radius={0} />
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)", lineHeight: 1.25 }}>{d.name}</div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 5 }}>{d.cuisine}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#F2994A" }}>{d.cal} kcal</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function DishModal({ t, dish, onClose, onAdd }) {
  return (
    <ModalShell onClose={onClose} noPadTop>
      <DishImage dish={dish} height={180} radius={16} />
      <div style={{ padding: "16px 4px 0" }}>
        <h2 className="nutrix-heading" style={{ fontSize: 19, fontWeight: 700, textAlign: "center", color: "var(--text)" }}>{dish.name}</h2>
        <div style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>{dish.cuisine}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 16 }}>
          <MiniStat label={t.calories} val={dish.cal} /><MiniStat label={t.protein} val={dish.p + "g"} />
          <MiniStat label={t.carbs} val={dish.c + "g"} /><MiniStat label={t.fat} val={dish.f + "g"} />
        </div>
        {dish.tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14, justifyContent: "center" }}>
            {dish.tags.map((tag) => <span key={tag} style={{ fontSize: 10.5, background: "#1F9D6C18", color: "#1F9D6C", padding: "3px 9px", borderRadius: 999, fontWeight: 600 }}>{tag}</span>)}
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{t.ingredients}</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.7 }}>{dish.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{t.steps}</div>
          <ol style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.7 }}>{dish.steps.map((s, idx) => <li key={idx}>{s}</li>)}</ol>
        </div>
        <button onClick={onAdd} className="nutrix-press" style={primaryBtn}>{t.addToLog}</button>
      </div>
    </ModalShell>
  );
}
function MiniStat({ label, val }) {
  return <div style={{ textAlign: "center" }}><div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{val}</div><div style={{ fontSize: 10, color: "var(--muted)" }}>{label}</div></div>;
}

/* ================================================================== */
/* Modals: shell / manual entry / photo entry                          */
/* ================================================================== */
function ModalShell({ children, onClose, noPadTop }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,16,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }}>
      <div className="nutrix-card" style={{ background: "var(--surface-2)", borderRadius: "22px 22px 0 0", padding: noPadTop ? "16px 20px 20px" : 20, width: "100%", maxWidth: 480, maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
          <button onClick={onClose} className="nutrix-press" style={{ border: "none", background: "var(--border)", borderRadius: 999, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color="var(--text-secondary)" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
const primaryBtn = { width: "100%", border: "none", background: "#1F9D6C", color: "#fff", borderRadius: 14, padding: "13px", fontWeight: 700, fontSize: 14, cursor: "pointer" };

function ManualEntryModal({ t, onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", cal: "", p: "", c: "", f: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.name.trim() !== "" && form.cal !== "";
  return (
    <ModalShell onClose={onClose}>
      <h2 className="nutrix-heading" style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>{t.manualEntry}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input placeholder={t.foodName} value={form.name} onChange={(e) => set("name", e.target.value)} style={modalInput} />
        <input type="number" placeholder={t.calories} value={form.cal} onChange={(e) => set("cal", e.target.value)} style={modalInput} />
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" placeholder={t.protein + " (g)"} value={form.p} onChange={(e) => set("p", e.target.value)} style={modalInput} />
          <input type="number" placeholder={t.carbs + " (g)"} value={form.c} onChange={(e) => set("c", e.target.value)} style={modalInput} />
          <input type="number" placeholder={t.fat + " (g)"} value={form.f} onChange={(e) => set("f", e.target.value)} style={modalInput} />
        </div>
        <button disabled={!valid} onClick={() => onAdd({ name: form.name.trim(), cal: Number(form.cal) || 0, p: Number(form.p) || 0, c: Number(form.c) || 0, f: Number(form.f) || 0 })}
          className="nutrix-press" style={{ ...primaryBtn, opacity: valid ? 1 : 0.5, cursor: valid ? "pointer" : "not-allowed", marginTop: 6 }}>{t.addToLog}</button>
      </div>
    </ModalShell>
  );
}
const modalInput = { flex: 1, padding: "11px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", fontSize: 13.5, outline: "none" };

function PhotoEntryModal({ t, onClose, onAdd }) {
  const [imgData, setImgData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  async function handleFile(file) {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      const mediaType = file.type || "image/jpeg";
      setImgData(reader.result);
      setStatus("analyzing");
      try {
        const text = await callClaude({
          system: "You are a food recognition system for a nutrition app. Look at the image and identify the food/beverage. Respond with ONLY a JSON object, no markdown fences, no preamble: {\"name\": string, \"cal\": number, \"p\": number, \"c\": number, \"f\": number}. Numbers are estimated totals for the visible serving. If multiple items are visible, combine into one entry with a combined name.",
          messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: mediaType, data: base64 } }, { type: "text", text: "Identify this food and estimate its nutrition." }] }],
        });
        const clean = text.replace(/```json|```/g, "").trim();
        let parsed;
        try { parsed = JSON.parse(clean); }
        catch (e1) {
          const match = clean.match(/\{[\s\S]*\}/);
          if (match) parsed = JSON.parse(match[0]); else throw e1;
        }
        setResult(parsed);
        setStatus("done");
      } catch (e) { setStatus("error"); }
    };
    reader.readAsDataURL(file);
  }

  return (
    <ModalShell onClose={onClose}>
      <h2 className="nutrix-heading" style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>{t.snapPhoto}</h2>
      {!imgData && (
        <button onClick={() => fileRef.current?.click()} className="nutrix-press" style={{
          width: "100%", border: "2px dashed var(--border)", borderRadius: 16, padding: "36px 12px", display: "flex",
          flexDirection: "column", alignItems: "center", gap: 8, background: "var(--surface)", cursor: "pointer",
        }}>
          <ImagePlus size={30} color="#1F9D6C" /><span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>{t.snapPhoto}</span>
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
      {imgData && (
        <div style={{ marginTop: 12 }}>
          <img src={imgData} alt="meal" style={{ width: "100%", borderRadius: 14, maxHeight: 220, objectFit: "cover" }} />
          {status === "analyzing" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", padding: 20, color: "var(--text-secondary)", fontSize: 13 }}>
              <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />{t.analyzing}
            </div>
          )}
          {status === "error" && <div style={{ padding: 16, textAlign: "center", color: "#C0563A", fontSize: 13 }}>Couldn't analyze that photo — try manual entry instead.</div>}
          {status === "done" && result && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 8 }}>{result.name}</div>
              <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                <MiniStat label={t.calories} val={result.cal} /><MiniStat label={t.protein} val={result.p + "g"} />
                <MiniStat label={t.carbs} val={result.c + "g"} /><MiniStat label={t.fat} val={result.f + "g"} />
              </div>
              <button onClick={() => onAdd(result)} className="nutrix-press" style={primaryBtn}>{t.confirmAdd}</button>
            </div>
          )}
        </div>
      )}
    </ModalShell>
  );
}

/* ================================================================== */
/* Coach Tab                                                            */
/* ================================================================== */
function CoachTab({ t, profile, goals, todayLog, totals }) {
  const [messages, setMessages] = useState([{ role: "assistant", text: t.coachIntro }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput(""); setLoading(true);
    const logSummary = todayLog.length ? todayLog.map((m) => `${m.name} (${m.cal} kcal, P${m.p}/C${m.c}/F${m.f})`).join("; ") : "no meals logged yet today";
    const system = `You are the NutriX AI nutrition coach, warm and encouraging but concise (3-5 sentences max unless asked for detail). User profile: ${profile.name || "User"}, age ${profile.age}, ${profile.gender}, ${profile.height}cm, ${profile.weight}kg, activity ${profile.activityLevel}, goal: ${profile.goal} weight. Daily targets: ${goals.calorieGoal} kcal, ${goals.proteinG}g protein, ${goals.carbsG}g carbs, ${goals.fatG}g fat, ${goals.waterGoalMl}ml water. Today so far: ${totals.cal} kcal, P${totals.p}/C${totals.c}/F${totals.f}, meals: ${logSummary}. Give personalized, practical nutrition guidance. Never diagnose medical conditions; suggest a doctor/dietitian for medical concerns.`;
    try {
      const apiMessages = [...messages, { role: "user", text: userMsg }]
        .filter((m, i) => !(i === 0 && m.role === "assistant"))
        .map((m) => ({ role: m.role, content: m.text }));
      const reply = await callClaude({ system, messages: apiMessages, maxTokens: 500 });
      setMessages((m) => [...m, { role: "assistant", text: reply || "Sorry, I couldn't generate a response — try again." }]);
    } catch (e) { setMessages((m) => [...m, { role: "assistant", text: "Something went wrong reaching the coach. Please try again." }]); }
    setLoading(false);
  }

  return (
    <div style={{ paddingTop: 8, display: "flex", flexDirection: "column", height: "calc(100vh - 160px)" }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "82%",
            background: m.role === "user" ? "#1F9D6C" : "var(--surface)", color: m.role === "user" ? "#fff" : "var(--text-strong)",
            padding: "10px 14px", borderRadius: 16, fontSize: 13.5, lineHeight: 1.5,
            boxShadow: m.role === "assistant" ? "0 3px 12px rgba(18,59,46,0.06)" : "none",
          }}>{m.text}</div>
        ))}
        {loading && <div style={{ alignSelf: "flex-start", background: "var(--surface)", borderRadius: 16, padding: "10px 14px" }}><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} color="#1F9D6C" /></div>}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 8, paddingTop: 8, position: "sticky", bottom: 0, background: "var(--bg)" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={t.askCoach} style={{ flex: 1, padding: "12px 14px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", fontSize: 13.5, outline: "none" }} />
        <button onClick={send} className="nutrix-press" style={{ width: 44, height: 44, borderRadius: 999, border: "none", background: "#1F9D6C", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Profile Tab                                                         */
/* ================================================================== */
function ProfileTab({ t, profile, goals, level, xp, unlockedBadges, weightHistory, onLogWeight, onOpenSettings, stats }) {
  const [wInput, setWInput] = useState("");
  return (
    <div style={{ paddingTop: 8, display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="nutrix-card" style={{ background: "linear-gradient(135deg,#123B2E,#1F6F54)", borderRadius: 20, padding: 20, color: "#fff", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20 }}>
          {(profile.name || "N")[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{profile.name || "Nutrix User"}</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>{t.level} {level} · {titleForLevel(level)} · {xp} XP</div>
        </div>
        <button onClick={onOpenSettings} className="nutrix-press" style={{ border: "none", background: "rgba(255,255,255,0.15)", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <SettingsIcon size={16} color="#fff" />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <StatBox label={t.calories} val={goals.calorieGoal} />
        <StatBox label={t.water} val={goals.waterGoalMl + "ml"} />
        <StatBox label={t.protein} val={goals.proteinG + "g"} />
        <StatBox label={t.goal} val={t[profile.goal]} />
      </div>

      <div>
        <h3 className="nutrix-heading" style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>{t.badges}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {BADGES.map((b) => {
            const unlocked = unlockedBadges.has(b.id);
            const color = TIER_COLOR[b.tier];
            const current = Math.min(stats[b.metric] || 0, b.goal);
            const pct = Math.round((current / b.goal) * 100);
            return (
              <div key={b.id} style={{
                display: "flex", alignItems: "center", gap: 12, background: "var(--surface)", borderRadius: 14,
                padding: "10px 12px", boxShadow: "0 3px 12px rgba(18,59,46,0.05)",
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: unlocked ? `${color}1A` : "var(--track)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                  {unlocked ? b.emoji : <Lock size={16} color="var(--muted)" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)" }}>{b.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color, background: `${color}18`, padding: "1px 6px", borderRadius: 999 }}>{TIER_LABEL[b.tier]}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>{b.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 5, background: "var(--track)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 999 }} />
                    </div>
                    <span style={{ fontSize: 10, color: "var(--muted)", flexShrink: 0 }}>{current}/{b.goal}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="nutrix-heading" style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>{t.weightHistory}</h3>
        <div style={{ background: "var(--surface)", borderRadius: 18, padding: "14px 6px", boxShadow: "0 4px 14px rgba(18,59,46,0.06)" }}>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weightHistory}>
              <CartesianGrid stroke="var(--track)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={30} domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid var(--border)" }} />
              <Line type="monotone" dataKey="weight" stroke="#1F9D6C" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 8, padding: "0 8px" }}>
            <input value={wInput} onChange={(e) => setWInput(e.target.value)} type="number" placeholder={t.logWeight}
              style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", fontSize: 13, outline: "none" }} />
            <button onClick={() => { if (wInput) { onLogWeight(Number(wInput)); setWInput(""); } }} className="nutrix-press"
              style={{ border: "none", background: "#1F9D6C", color: "#fff", borderRadius: 10, padding: "9px 14px", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
              <Check size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function StatBox({ label, val }) {
  return <div style={{ background: "var(--surface)", borderRadius: 14, padding: "12px 14px", boxShadow: "0 3px 12px rgba(18,59,46,0.05)" }}><div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{val}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>{label}</div></div>;
}
