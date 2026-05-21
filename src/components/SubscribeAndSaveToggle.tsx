import { ChevronDown, Repeat, Tag } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  hasSellingPlanIds,
  SUBSCRIBE_CADENCES,
  type PurchaseChoice,
  type SubscribeCadence,
} from "@/lib/shopify-selling-plans";

type SubscribeAndSaveToggleProps = {
  price: number;
  choice: PurchaseChoice;
  cadence: SubscribeCadence;
  onChoiceChange: (choice: PurchaseChoice) => void;
  onCadenceChange: (cadence: SubscribeCadence) => void;
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

const SubscribeAndSaveToggle = ({
  price,
  choice,
  cadence,
  onChoiceChange,
  onCadenceChange,
}: SubscribeAndSaveToggleProps) => {
  const subscriptionReady = hasSellingPlanIds();
  const subscribePrice = price * 0.9;

  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/20 p-3 md:p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Repeat className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-foreground">
              Subscribe & save
            </p>
            <p className="text-xs text-muted-foreground">
              Save 10%. Skip or cancel anytime.
            </p>
          </div>
        </div>
        <span className="hidden rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-display font-bold uppercase tracking-[0.14em] text-primary sm:inline-flex">
          10% off
        </span>
      </div>

      <div className="grid gap-2">
        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border/70 bg-background/60 px-3 py-3 transition-colors hover:border-primary/40">
          <span className="flex items-center gap-2">
            <input
              type="radio"
              name="purchase-choice"
              checked={choice === "one-time"}
              onChange={() => onChoiceChange("one-time")}
              className="h-4 w-4 accent-[hsl(var(--flame))]"
            />
            <span className="font-display text-sm font-bold text-foreground">
              One-time purchase
            </span>
          </span>
          <span className="font-display text-sm font-bold text-foreground">
            {formatUsd(price)}
          </span>
        </label>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block">
              <label
                className={`flex items-center justify-between rounded-xl border px-3 py-3 transition-colors ${
                  subscriptionReady
                    ? "cursor-pointer border-primary/50 bg-primary/10 hover:border-primary"
                    : "cursor-not-allowed border-border/50 bg-background/30 opacity-60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="purchase-choice"
                    checked={choice === "subscribe"}
                    onChange={() => subscriptionReady && onChoiceChange("subscribe")}
                    disabled={!subscriptionReady}
                    className="h-4 w-4 accent-[hsl(var(--flame))]"
                  />
                  <span>
                    <span className="block font-display text-sm font-bold text-foreground">
                      Subscribe & save 10%
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Tag className="h-3 w-3" />
                      {formatUsd(subscribePrice)} today
                    </span>
                  </span>
                </span>
                <span className="font-display text-sm font-bold text-primary">
                  <span className="mr-1 text-xs text-muted-foreground line-through">
                    {formatUsd(price)}
                  </span>
                  {formatUsd(subscribePrice)}
                </span>
              </label>
            </span>
          </TooltipTrigger>
          {!subscriptionReady && (
            <TooltipContent>
              Subscribe & save launching soon
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {choice === "subscribe" && subscriptionReady && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-3 py-3">
          <label className="text-xs font-display font-bold uppercase tracking-[0.15em] text-foreground/60">
            Delivery cadence
          </label>
          <div className="relative">
            <select
              value={cadence}
              onChange={(event) => onCadenceChange(Number(event.target.value) as SubscribeCadence)}
              className="appearance-none rounded-full border border-border/70 bg-background px-4 py-2 pr-9 text-sm font-display font-bold text-foreground outline-none transition-colors focus:border-primary"
            >
              {SUBSCRIBE_CADENCES.map((days) => (
                <option key={days} value={days}>
                  Every {days} days
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscribeAndSaveToggle;
