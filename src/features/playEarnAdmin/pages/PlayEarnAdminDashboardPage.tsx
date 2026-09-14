import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Ban,
  CheckCircle2,
  Clock3,
  Gamepad2,
  Gift,
  IndianRupee,
  RefreshCw,
  Settings,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type DashboardStats = {
  total_wallets: number;
  active_wallets: number;
  blocked_wallets: number;

  total_wallet_balance_paise: number;
  total_credits_paise: number;
  total_debits_paise: number;
  total_expired_paise: number;

  today_credits_paise: number;
  today_debits_paise: number;
  today_expired_paise: number;

  total_three_numbers_plays: number;
  today_three_numbers_plays: number;
  total_three_numbers_wins: number;
  total_three_numbers_rewards_paise: number;
};

type GameSetting = {
  id: string;
  game_key: string;
  display_name: string;
  enabled: boolean;
  daily_limit: number | null;
  reward_expiry_days: number;
  reward_config: Record<string, unknown>;
};

const DEFAULT_STATS: DashboardStats = {
  total_wallets: 0,
  active_wallets: 0,
  blocked_wallets: 0,

  total_wallet_balance_paise: 0,
  total_credits_paise: 0,
  total_debits_paise: 0,
  total_expired_paise: 0,

  today_credits_paise: 0,
  today_debits_paise: 0,
  today_expired_paise: 0,

  total_three_numbers_plays: 0,
  today_three_numbers_plays: 0,
  total_three_numbers_wins: 0,
  total_three_numbers_rewards_paise: 0,
};

function formatMoney(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format((paise || 0) / 100);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value || 0);
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: typeof WalletCards;
  iconClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            iconClassName || "bg-slate-100 text-slate-700"
          }`}
        >
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

function ActivityRow({
  label,
  value,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string;
  icon: typeof ArrowUpFromLine;
  iconClassName: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0 last:pb-0 first:pt-0">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
        >
          <Icon size={16} strokeWidth={1.8} />
        </div>

        <span className="truncate text-sm font-medium text-slate-700">
          {label}
        </span>
      </div>

      <span className="shrink-0 text-sm font-semibold text-slate-950">
        {value}
      </span>
    </div>
  );
}

function GameStatusCard({
  game,
}: {
  game: GameSetting;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
            <Gamepad2 size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-950">
              {game.display_name}
            </h3>

            <p className="mt-0.5 text-xs text-slate-400">
              {game.daily_limit
                ? `${game.daily_limit} daily play${
                    game.daily_limit === 1 ? "" : "s"
                  }`
                : "No daily limit"}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
            game.enabled
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              game.enabled ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
          {game.enabled ? "Live" : "Disabled"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Reward expiry
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {game.reward_expiry_days} days
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Game key
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-900">
            {game.game_key}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PlayEarnAdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [games, setGames] = useState<GameSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    try {
      setError(null);

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [statsResult, gamesResult] = await Promise.all([
        supabase.rpc("admin_get_play_earn_dashboard_stats"),
        supabase.rpc("admin_get_play_earn_game_settings"),
      ]);

      if (statsResult.error) {
        throw new Error(statsResult.error.message);
      }

      if (gamesResult.error) {
        throw new Error(gamesResult.error.message);
      }

      const statsData = statsResult.data;

      if (Array.isArray(statsData)) {
        setStats(statsData[0] || DEFAULT_STATS);
      } else {
        setStats(statsData || DEFAULT_STATS);
      }

      setGames((gamesResult.data || []) as GameSetting[]);
    } catch (err) {
      console.error("Play & Earn dashboard error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Play & Earn dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const winRate = useMemo(() => {
    if (!stats.total_three_numbers_plays) return 0;

    return (
      (stats.total_three_numbers_wins /
        stats.total_three_numbers_plays) *
      100
    );
  }, [stats.total_three_numbers_plays, stats.total_three_numbers_wins]);

  const liveGames = games.filter((game) => game.enabled).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
                <Sparkles size={16} />
              </span>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                T&M Jewels
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Play & Earn
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Manage games, reward wallets and redemption controls from one
              place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadDashboard(true)}
            disabled={refreshing}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </section>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <Ban size={18} className="mt-0.5 shrink-0" />

          <div className="min-w-0">
            <p className="text-sm font-semibold">
              Unable to load Play & Earn data
            </p>

            <p className="mt-1 break-words text-xs text-red-600">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          PRIMARY STATS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Wallet Balance"
          value={formatMoney(stats.total_wallet_balance_paise)}
          subtitle="Active Play & Earn wallets"
          icon={WalletCards}
          iconClassName="bg-amber-50 text-amber-700"
        />

        <StatCard
          title="Total Wallets"
          value={formatNumber(stats.total_wallets)}
          subtitle={`${formatNumber(stats.active_wallets)} active`}
          icon={Users}
          iconClassName="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Rewards Issued"
          value={formatMoney(stats.total_credits_paise)}
          subtitle="All wallet credits"
          icon={Gift}
          iconClassName="bg-violet-50 text-violet-700"
        />

        <StatCard
          title="Redeemed"
          value={formatMoney(stats.total_debits_paise)}
          subtitle="Play & Earn wallet debits"
          icon={ArrowDownToLine}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
      </div>

      {/* ======================================================
          SECONDARY STATS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Expired"
          value={formatMoney(stats.total_expired_paise)}
          subtitle="Expired wallet rewards"
          icon={Clock3}
          iconClassName="bg-slate-100 text-slate-600"
        />

        <StatCard
          title="Blocked Wallets"
          value={formatNumber(stats.blocked_wallets)}
          subtitle="Wallets currently blocked"
          icon={Ban}
          iconClassName="bg-red-50 text-red-600"
        />

        <StatCard
          title="Games Live"
          value={`${liveGames}/${games.length || 0}`}
          subtitle="Currently enabled"
          icon={Gamepad2}
          iconClassName="bg-indigo-50 text-indigo-700"
        />

        <StatCard
          title="3 Numbers Plays"
          value={formatNumber(stats.total_three_numbers_plays)}
          subtitle={`${formatNumber(
            stats.today_three_numbers_plays
          )} played today`}
          icon={Activity}
          iconClassName="bg-pink-50 text-pink-700"
        />
      </div>

      {/* ======================================================
          TODAY + 3 NUMBERS
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Today's activity */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Today&apos;s Wallet Activity
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Current day reward movement
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
              <Activity size={17} />
            </div>
          </div>

          <div className="mt-6">
            <ActivityRow
              label="Rewards credited"
              value={formatMoney(stats.today_credits_paise)}
              icon={ArrowUpFromLine}
              iconClassName="bg-emerald-50 text-emerald-600"
            />

            <ActivityRow
              label="Rewards redeemed"
              value={formatMoney(stats.today_debits_paise)}
              icon={ArrowDownToLine}
              iconClassName="bg-blue-50 text-blue-600"
            />

            <ActivityRow
              label="Rewards expired"
              value={formatMoney(stats.today_expired_paise)}
              icon={Clock3}
              iconClassName="bg-slate-100 text-slate-600"
            />
          </div>
        </section>

        {/* 3 Numbers */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                3 Numbers
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Game performance overview
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Gamepad2 size={17} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total plays
              </p>

              <p className="mt-2 text-xl font-bold text-slate-950">
                {formatNumber(stats.total_three_numbers_plays)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Today
              </p>

              <p className="mt-2 text-xl font-bold text-slate-950">
                {formatNumber(stats.today_three_numbers_plays)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Wins
              </p>

              <p className="mt-2 text-xl font-bold text-slate-950">
                {formatNumber(stats.total_three_numbers_wins)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Win rate
              </p>

              <p className="mt-2 text-xl font-bold text-slate-950">
                {winRate.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <IndianRupee size={15} className="text-amber-700" />

              <span className="text-xs font-semibold text-amber-800">
                Total rewards from 3 Numbers
              </span>
            </div>

            <span className="text-sm font-bold text-amber-900">
              {formatMoney(
                stats.total_three_numbers_rewards_paise
              )}
            </span>
          </div>
        </section>
      </div>

      {/* ======================================================
          GAME STATUS
      ====================================================== */}

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-950">
              Game Status
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Current configuration of Play & Earn games
            </p>
          </div>

          <a
            href="/play-earn-admin/games"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950"
          >
            Manage games
            <Settings size={14} />
          </a>
        </div>

        {games.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Gamepad2
              size={24}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-semibold text-slate-700">
              No games configured
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Add Play & Earn game settings to see them here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {games.map((game) => (
              <GameStatusCard
                key={game.id || game.game_key}
                game={game}
              />
            ))}
          </div>
        )}
      </section>

      {/* ======================================================
          QUICK ACTIONS
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-base font-bold text-slate-950">
            Quick Management
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Jump directly to the Play & Earn controls.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <a
            href="/play-earn-admin/games"
            className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Gamepad2 size={17} />
            </span>

            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Game Settings
              </span>

              <span className="mt-0.5 block text-xs text-slate-400">
                Limits & rewards
              </span>
            </span>
          </a>

          <a
            href="/play-earn-admin/wallets"
            className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <WalletCards size={17} />
            </span>

            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Customer Wallets
              </span>

              <span className="mt-0.5 block text-xs text-slate-400">
                Balances & transactions
              </span>
            </span>
          </a>

          <a
            href="/play-earn-admin/checkout"
            className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={17} />
            </span>

            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Checkout Settings
              </span>

              <span className="mt-0.5 block text-xs text-slate-400">
                Redemption rules
              </span>
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}