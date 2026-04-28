import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ChefHat, Flame as FireIcon, ShoppingCart } from "lucide-react";

interface RecipeCardProps {
  title: string;
  image: string;
  time: string;
  difficulty: string;
  bestWith: string;
  calories: string;
}

const RecipeCard = ({ title, image, time, difficulty, bestWith, calories }: RecipeCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ duration: 0.25 }}
    className="group bg-gradient-card rounded-2xl border border-border overflow-hidden"
  >
    <div className="relative aspect-video overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      <div className="absolute top-3 left-3">
        <span className="px-3 py-1 rounded-full bg-gradient-fire text-primary-foreground text-[10px] font-display font-bold uppercase tracking-wider flex items-center gap-1">
          <FireIcon className="h-3 w-3" />
          {bestWith}
        </span>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <span className="text-[10px] font-display uppercase tracking-wider text-primary/80 mb-1 block">Cooked With NoodleBomb</span>
        <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      </div>
    </div>
    <div className="p-5">
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{time}</span>
        <span className="flex items-center gap-1.5"><ChefHat className="h-3.5 w-3.5" />{difficulty}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{calories} cal</span>
        <Link
          to="/shop"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-display font-semibold text-primary hover:bg-primary/20 transition-colors"
        >
          <ShoppingCart className="h-3 w-3" />
          Shop {bestWith}
        </Link>
      </div>
    </div>
  </motion.div>
);

export default RecipeCard;
