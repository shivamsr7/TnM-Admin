import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AlertCircle,
  Check,
  Clock3,
  Gamepad2,
  Gift,
  Loader2,
  Plus,
  Save,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Trophy,
} from "lucide-react";

import { supabase } from "@/lib/supabase";


/* ============================================================
   TYPES
============================================================ */

type GameKey =
  | "three_numbers"
  | "scratch_win"
  | "daily_poll";


type GameSetting = {
  id: string;
  game_key: GameKey;
  display_name: string;
  enabled: boolean;
  daily_limit: number | null;
  reward_expiry_days: number;
  reward_config: Record<string, unknown>;
};


type ThreeNumbersConfig = {
  mode?: string;
  reward_paise?: number;
  rewards?: Record<string, unknown>;
};


type ScratchReward = {
  label: string;
  amount_paise: number;
  probability: number;
};


type ScratchConfig = {
  mode?: string;
  rewards?: ScratchReward[];
};


type DailyPollConfig = {
  base_reward_paise?: number;
  streak_rewards?: Record<string, number>;
  weekly_reward_paise?: number;
};


/* ============================================================
   GAME META
============================================================ */

const GAME_META: Record<
  GameKey,
  {
    title: string;
    description: string;
    icon: typeof Gamepad2;
    accent: string;
  }
> = {
  three_numbers: {
    title: "3 Numbers",
    description:
      "Three-reel number game with a daily play limit.",
    icon: Gamepad2,
    accent:
      "bg-violet-50 text-violet-700",
  },

  scratch_win: {
    title: "Scratch & Win",
    description:
      "Scratch card with configurable rewards and winning probabilities.",
    icon: Gift,
    accent:
      "bg-purple-50 text-purple-700",
  },

  daily_poll: {
    title: "Daily Poll",
    description:
      "Daily poll with a seven-day streak reward system.",
    icon: Sparkles,
    accent:
      "bg-blue-50 text-blue-700",
  },
};


/* ============================================================
   DEFAULT GAMES
============================================================ */

const DEFAULT_GAMES: GameSetting[] = [
  {
    id: "",
    game_key: "three_numbers",
    display_name: "3 Numbers",
    enabled: true,
    daily_limit: 5,
    reward_expiry_days: 7,
    reward_config: {
      mode: "configurable",
      rewards: {},
    },
  },

  {
    id: "",
    game_key: "scratch_win",
    display_name: "Scratch & Win",
    enabled: true,
    daily_limit: 1,
    reward_expiry_days: 7,
    reward_config: {
      mode: "weighted_random",
      rewards: [],
    },
  },

  {
    id: "",
    game_key: "daily_poll",
    display_name: "Daily Poll",
    enabled: true,
    daily_limit: 1,
    reward_expiry_days: 7,
    reward_config: {
      base_reward_paise: 0,
      streak_rewards: {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
      },
      weekly_reward_paise: 0,
    },
  },
];


/* ============================================================
   CONSTANTS
============================================================ */

const MAX_SCRATCH_REWARD_PAISE = 1000;


/* ============================================================
   HELPERS
============================================================ */

function paiseToRupees(
  paise: number | null | undefined
): string {
  return (
    (Number(paise) || 0) / 100
  ).toString();
}


function rupeesToPaise(
  value: string
): number {
  const amount = Number(value);

  if (
    !Number.isFinite(amount) ||
    amount < 0
  ) {
    return 0;
  }

  return Math.round(
    amount * 100
  );
}


/* ============================================================
   3 NUMBERS CONFIG
============================================================ */

function getThreeNumbersReward(
  config: Record<string, unknown>
): number {
  const typed =
    config as ThreeNumbersConfig;

  if (
    typed.reward_paise != null
  ) {
    return (
      Number(
        typed.reward_paise
      ) || 0
    );
  }

  return 0;
}


/* ============================================================
   SCRATCH CONFIG
============================================================ */

function getScratchRewards(
  config: Record<string, unknown>
): ScratchReward[] {
  const typed =
    config as ScratchConfig;

  if (
    !Array.isArray(
      typed.rewards
    )
  ) {
    return [];
  }

  return typed.rewards.map(
    (reward) => ({
      label:
        typeof reward?.label ===
        "string"
          ? reward.label
          : Number(
                reward?.amount_paise
              ) === 0
            ? "Better Luck Next Time"
            : "Reward",

      amount_paise:
        Math.max(
          0,
          Number(
            reward?.amount_paise
          ) || 0
        ),

      probability:
        Math.max(
          0,
          Number(
            reward?.probability
          ) || 0
        ),
    })
  );
}


/* ============================================================
   DAILY POLL CONFIG
============================================================ */

function getDailyPollConfig(
  config: Record<string, unknown>
): DailyPollConfig {
  const typed =
    config as DailyPollConfig;

  const streakRewards:
    Record<string, number> = {};

  for (
    let day = 1;
    day <= 7;
    day += 1
  ) {
    streakRewards[
      String(day)
    ] =
      Number(
        typed.streak_rewards?.[
          String(day)
        ]
      ) || 0;
  }

  return {
    base_reward_paise:
      Number(
        typed.base_reward_paise
      ) || 0,

    streak_rewards:
      streakRewards,

    weekly_reward_paise:
      Number(
        typed.weekly_reward_paise
      ) || 0,
  };
}


/* ============================================================
   SECTION CARD
============================================================ */

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div
        className="
          border-b
          border-slate-100
          px-5
          py-4
          sm:px-6
        "
      >
        <h2
          className="
            text-sm
            font-bold
            text-slate-950
          "
        >
          {title}
        </h2>

        {description && (
          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            {description}
          </p>
        )}
      </div>

      <div
        className="
          p-5
          sm:p-6
        "
      >
        {children}
      </div>
    </section>
  );
}


/* ============================================================
   FIELD LABEL
============================================================ */

function FieldLabel({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div
      className="
        mb-2
        flex
        items-center
        justify-between
        gap-3
      "
    >
      <label
        className="
          text-xs
          font-semibold
          text-slate-700
        "
      >
        {children}
      </label>

      {hint && (
        <span
          className="
            text-[10px]
            text-slate-400
          "
        >
          {hint}
        </span>
      )}
    </div>
  );
}


/* ============================================================
   NUMBER FIELD
============================================================ */

function NumberField({
  label,
  value,
  onChange,
  hint,
  min = 0,
  max,
  step = 1,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <FieldLabel hint={hint}>
        {label}
      </FieldLabel>

      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          h-11
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          text-sm
          font-medium
          text-slate-900
          outline-none
          transition
          placeholder:text-slate-300
          focus:border-slate-400
          focus:ring-4
          focus:ring-slate-100
        "
      />
    </div>
  );
}


/* ============================================================
   SCRATCH LABEL FIELD
============================================================ */

function ScratchLabelField({
  value,
  onChange,
}: {
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>
      <FieldLabel>
        Reward Label
      </FieldLabel>

      <input
        type="text"
        value={value}
        maxLength={60}
        placeholder="e.g. ₹5 Reward"
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          h-11
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          text-sm
          font-medium
          text-slate-900
          outline-none
          transition
          placeholder:text-slate-300
          focus:border-slate-400
          focus:ring-4
          focus:ring-slate-100
        "
      />
    </div>
  );
}


/* ============================================================
   MAIN PAGE
============================================================ */

export default function PlayEarnGameSettingsPage() {

  const [
    games,
    setGames,
  ] = useState<GameSetting[]>([]);

  const [
    selectedGameKey,
    setSelectedGameKey,
  ] =
    useState<GameKey>(
      "three_numbers"
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const [
    success,
    setSuccess,
  ] =
    useState<string | null>(
      null
    );


  /* ==========================================================
     SELECTED GAME
  ========================================================== */

  const selectedGame =
    useMemo(
      () =>
        games.find(
          (game) =>
            game.game_key ===
            selectedGameKey
        ) ||
        DEFAULT_GAMES.find(
          (game) =>
            game.game_key ===
            selectedGameKey
        )!,
      [
        games,
        selectedGameKey,
      ]
    );


  /* ==========================================================
     LOAD GAMES
  ========================================================== */

  const loadGames =
    useCallback(
      async () => {

        try {

          setLoading(true);
          setError(null);

          const {
            data,
            error: rpcError,
          } =
            await supabase.rpc(
              "admin_get_play_earn_game_settings"
            );

          if (rpcError) {
            throw new Error(
              rpcError.message
            );
          }

          const loadedGames =
            (data || []) as GameSetting[];

          const mergedGames =
            DEFAULT_GAMES.map(
              (fallback) =>
                loadedGames.find(
                  (game) =>
                    game.game_key ===
                    fallback.game_key
                ) ||
                fallback
            );

          setGames(
            mergedGames
          );

        } catch (err) {

          console.error(
            "Failed to load Play & Earn game settings:",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load game settings."
          );

        } finally {

          setLoading(false);

        }

      },
      []
    );


  useEffect(() => {
    void loadGames();
  }, [loadGames]);


  /* ==========================================================
     UPDATE SELECTED GAME
  ========================================================== */

  const updateSelectedGame =
    (
      updater: (
        game: GameSetting
      ) => GameSetting
    ) => {

      setGames(
        (current) =>
          current.map(
            (game) =>
              game.game_key ===
              selectedGameKey
                ? updater(game)
                : game
          )
      );

    };


  /* ==========================================================
     SCRATCH REWARDS
  ========================================================== */

  const scratchRewards =
    getScratchRewards(
      selectedGame.reward_config
    );


  const scratchProbabilityTotal =
    scratchRewards.reduce(
      (
        total,
        reward
      ) =>
        total +
        Number(
          reward.probability
        ),
      0
    );


  const scratchProbabilityValid =
    scratchRewards.length > 0 &&
    Math.abs(
      scratchProbabilityTotal -
        100
    ) < 0.0001;


  const scratchRewardAmountsValid =
    scratchRewards.every(
      (reward) =>
        reward.amount_paise >= 0 &&
        reward.amount_paise <=
          MAX_SCRATCH_REWARD_PAISE
    );


  const scratchLabelsValid =
    scratchRewards.every(
      (reward) =>
        reward.label.trim()
          .length > 0
    );


  const scratchProbabilitiesValid =
    scratchRewards.every(
      (reward) =>
        reward.probability >= 0 &&
        reward.probability <= 100
    );


  const scratchConfigValid =
    scratchRewards.length > 0 &&
    scratchProbabilityValid &&
    scratchRewardAmountsValid &&
    scratchLabelsValid &&
    scratchProbabilitiesValid;


  /* ==========================================================
     THREE NUMBERS
  ========================================================== */

  const threeNumbersReward =
    getThreeNumbersReward(
      selectedGame.reward_config
    );


  /* ==========================================================
     DAILY POLL
  ========================================================== */

  const dailyPoll =
    getDailyPollConfig(
      selectedGame.reward_config
    );


  /* ==========================================================
     UPDATE 3 NUMBERS
  ========================================================== */

  const updateThreeNumbersReward =
    (value: string) => {

      updateSelectedGame(
        (game) => ({
          ...game,

          reward_config: {
            ...game.reward_config,

            mode:
              "configurable",

            reward_paise:
              rupeesToPaise(
                value
              ),
          },
        })
      );

    };


  /* ==========================================================
     UPDATE SCRATCH
  ========================================================== */

  const updateScratchRewards =
    (
      rewards: ScratchReward[]
    ) => {

      updateSelectedGame(
        (game) => ({
          ...game,

          reward_config: {
            mode:
              "weighted_random",

            rewards,
          },
        })
      );

    };


  /* ==========================================================
     UPDATE DAILY POLL
  ========================================================== */

  const updateDailyPoll =
    (
      updater: (
        current: DailyPollConfig
      ) => DailyPollConfig
    ) => {

      updateSelectedGame(
        (game) => {

          const current =
            getDailyPollConfig(
              game.reward_config
            );

          return {
            ...game,

            reward_config:
              updater(
                current
              ),
          };

        }
      );

    };


  /* ==========================================================
     ADD SCRATCH REWARD
  ========================================================== */

  const addScratchReward =
    () => {

      updateScratchRewards([
        ...scratchRewards,

        {
          label:
            "Better Luck Next Time",

          amount_paise:
            0,

          probability:
            0,
        },
      ]);

    };


  /* ==========================================================
     SAVE
  ========================================================== */

  const saveGame =
    async () => {

      if (!selectedGame) {
        return;
      }


      /* ======================================================
         SCRATCH VALIDATION
      ====================================================== */

      if (
        selectedGame.game_key ===
        "scratch_win"
      ) {

        if (
          scratchRewards.length ===
          0
        ) {

          setError(
            "Add at least one Scratch & Win reward before saving."
          );

          return;
        }


        if (
          !scratchLabelsValid
        ) {

          setError(
            "Every Scratch & Win reward must have a label."
          );

          return;
        }


        if (
          !scratchProbabilitiesValid
        ) {

          setError(
            "Scratch & Win probabilities must be between 0% and 100%."
          );

          return;
        }


        if (
          !scratchRewardAmountsValid
        ) {

          setError(
            "Scratch & Win rewards cannot exceed ₹10 in Phase 1."
          );

          return;
        }


        if (
          !scratchProbabilityValid
        ) {

          setError(
            `Scratch & Win probabilities must total exactly 100%. Current total: ${scratchProbabilityTotal.toFixed(
              2
            )}%.`
          );

          return;
        }

      }


      try {

        setSaving(true);
        setError(null);
        setSuccess(null);


        let rewardConfig =
          selectedGame.reward_config ||
          {};


        /* ====================================================
           3 NUMBERS
        ==================================================== */

        if (
          selectedGame.game_key ===
          "three_numbers"
        ) {

          const current =
            selectedGame.reward_config as ThreeNumbersConfig;

          rewardConfig = {
            ...current,

            mode:
              "configurable",

            reward_paise:
              getThreeNumbersReward(
                selectedGame.reward_config
              ),
          };

        }


        /* ====================================================
           SCRATCH & WIN
        ==================================================== */

        if (
          selectedGame.game_key ===
          "scratch_win"
        ) {

          rewardConfig = {
            mode:
              "weighted_random",

            rewards:
              scratchRewards.map(
                (reward) => ({
                  label:
                    reward.label.trim(),

                  amount_paise:
                    Math.round(
                      reward.amount_paise
                    ),

                  probability:
                    Number(
                      reward.probability
                    ),
                })
              ),
          };

        }


        /* ====================================================
           DAILY POLL
        ==================================================== */

        if (
          selectedGame.game_key ===
          "daily_poll"
        ) {

          const current =
            getDailyPollConfig(
              selectedGame.reward_config
            );

          rewardConfig = {
            base_reward_paise:
              current.base_reward_paise,

            streak_rewards:
              current.streak_rewards,

            weekly_reward_paise:
              current.weekly_reward_paise,
          };

        }


        /* ====================================================
           SAVE RPC
        ==================================================== */

        const {
          data,
          error: rpcError,
        } =
          await supabase.rpc(
            "admin_update_play_earn_game_settings",
            {
              p_game_key:
                selectedGame.game_key,

              p_enabled:
                selectedGame.enabled,

              p_daily_limit:
                selectedGame.daily_limit,

              p_reward_expiry_days:
                selectedGame.reward_expiry_days,

              p_reward_config:
                rewardConfig,
            }
          );


        if (rpcError) {
          throw new Error(
            rpcError.message
          );
        }


        const saved =
          Array.isArray(data)
            ? data[0]
            : data;


        if (saved) {

          setGames(
            (current) =>
              current.map(
                (game) =>
                  game.game_key ===
                  selectedGame.game_key
                    ? (
                        saved as GameSetting
                      )
                    : game
              )
          );

        }


        setSuccess(
          `${selectedGame.display_name} settings saved successfully.`
        );

      } catch (err) {

        console.error(
          "Failed to save Play & Earn game settings:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to save game settings."
        );

      } finally {

        setSaving(false);

      }

    };


  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {

    return (
      <div className="space-y-6">

        <div
          className="
            h-28
            animate-pulse
            rounded-2xl
            bg-slate-200
          "
        />

        <div
          className="
            grid
            gap-6
            lg:grid-cols-[280px_minmax(0,1fr)]
          "
        >

          <div
            className="
              h-96
              animate-pulse
              rounded-2xl
              bg-slate-200
            "
          />

          <div
            className="
              h-[600px]
              animate-pulse
              rounded-2xl
              bg-slate-200
            "
          />

        </div>

      </div>
    );
  }


  const GameIcon =
    GAME_META[
      selectedGameKey
    ].icon;


  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          sm:p-6
        "
      >

        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-slate-950
                  text-white
                "
              >
                <Gamepad2 size={16} />
              </span>


              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-slate-400
                "
              >
                Play & Earn
              </span>

            </div>


            <h1
              className="
                mt-3
                text-2xl
                font-bold
                tracking-tight
                text-slate-950
                sm:text-3xl
              "
            >
              Game Settings
            </h1>


            <p
              className="
                mt-1
                max-w-2xl
                text-sm
                text-slate-500
              "
            >
              Control game availability, daily limits,
              reward expiry and reward configurations.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================================
          ALERTS
      ====================================================== */}

      {error && (
        <div
          className="
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-4
            text-red-700
          "
        >

          <AlertCircle
            size={18}
            className="
              mt-0.5
              shrink-0
            "
          />


          <div>

            <p
              className="
                text-sm
                font-semibold
              "
            >
              Something went wrong
            </p>


            <p
              className="
                mt-1
                break-words
                text-xs
                text-red-600
              "
            >
              {error}
            </p>

          </div>

        </div>
      )}


      {success && (
        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            p-4
            text-emerald-700
          "
        >

          <Check
            size={18}
            className="shrink-0"
          />


          <p
            className="
              text-sm
              font-semibold
            "
          >
            {success}
          </p>

        </div>
      )}


      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          grid
          gap-6
          lg:grid-cols-[280px_minmax(0,1fr)]
        "
      >

        {/* ====================================================
            GAME SELECTOR
        ==================================================== */}

        <aside
          className="
            h-fit
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-3
            shadow-sm
          "
        >

          <div
            className="
              px-3
              py-3
            "
          >

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-slate-400
              "
            >
              Games
            </p>


            <p
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              Select a game to configure
            </p>

          </div>


          <div className="space-y-1">

            {games.map(
              (game) => {

                const meta =
                  GAME_META[
                    game.game_key
                  ];

                const Icon =
                  meta.icon;

                const active =
                  game.game_key ===
                  selectedGameKey;


                return (
                  <button
                    key={
                      game.game_key
                    }
                    type="button"
                    onClick={() => {

                      setSelectedGameKey(
                        game.game_key
                      );

                      setError(null);

                      setSuccess(null);

                    }}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      p-3
                      text-left
                      transition
                      ${
                        active
                          ? "bg-slate-950 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-50"
                      }
                    `}
                  >

                    <span
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        ${
                          active
                            ? "bg-white/10 text-white"
                            : meta.accent
                        }
                      `}
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                      />
                    </span>


                    <span
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <span
                        className={`
                          block
                          truncate
                          text-sm
                          font-semibold
                          ${
                            active
                              ? "text-white"
                              : "text-slate-900"
                          }
                        `}
                      >
                        {
                          game.display_name
                        }
                      </span>


                      <span
                        className={`
                          mt-0.5
                          block
                          text-[10px]
                          ${
                            active
                              ? "text-slate-300"
                              : "text-slate-400"
                          }
                        `}
                      >
                        {
                          game.enabled
                            ? "Enabled"
                            : "Disabled"
                        }
                      </span>

                    </span>


                    {game.enabled ? (

                      <ToggleRight
                        size={18}
                        className={
                          active
                            ? "text-emerald-300"
                            : "text-emerald-500"
                        }
                      />

                    ) : (

                      <ToggleLeft
                        size={18}
                        className={
                          active
                            ? "text-slate-300"
                            : "text-slate-400"
                        }
                      />

                    )}

                  </button>
                );

              }
            )}

          </div>

        </aside>


        {/* ====================================================
            SETTINGS
        ==================================================== */}

        <div
          className="
            min-w-0
            space-y-6
          "
        >

          {/* ==================================================
              GAME HEADER
          ================================================== */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              sm:p-6
            "
          >

            <div
              className="
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-4
                "
              >

                <div
                  className={`
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    ${
                      GAME_META[
                        selectedGameKey
                      ].accent
                    }
                  `}
                >
                  <GameIcon
                    size={21}
                    strokeWidth={1.8}
                  />
                </div>


                <div
                  className="
                    min-w-0
                  "
                >

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-slate-950
                    "
                  >
                    {
                      selectedGame.display_name
                    }
                  </h2>


                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-400
                    "
                  >
                    {
                      GAME_META[
                        selectedGameKey
                      ].description
                    }
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  updateSelectedGame(
                    (game) => ({
                      ...game,
                      enabled:
                        !game.enabled,
                    })
                  )
                }
                className={`
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-4
                  text-xs
                  font-bold
                  transition
                  ${
                    selectedGame.enabled
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }
                `}
              >

                {selectedGame.enabled ? (

                  <>
                    <ToggleRight
                      size={18}
                    />

                    Enabled
                  </>

                ) : (

                  <>
                    <ToggleLeft
                      size={18}
                    />

                    Disabled
                  </>

                )}

              </button>

            </div>

          </section>


          {/* ==================================================
              GENERAL SETTINGS
          ================================================== */}

          <SectionCard
            title="General Settings"
            description="Basic availability and reward behaviour."
          >

            <div
              className="
                grid
                gap-5
                sm:grid-cols-2
              "
            >

              <NumberField
                label="Daily Play Limit"
                hint="Leave blank for unlimited"
                value={
                  selectedGame.daily_limit ??
                  ""
                }
                min={1}
                onChange={(value) =>
                  updateSelectedGame(
                    (game) => ({
                      ...game,

                      daily_limit:
                        value.trim() ===
                        ""
                          ? null
                          : Math.max(
                              1,
                              Number(
                                value
                              ) || 1
                            ),
                    })
                  )
                }
              />


              <NumberField
                label="Reward Expiry"
                hint="Days"
                value={
                  selectedGame.reward_expiry_days
                }
                min={1}
                onChange={(value) =>
                  updateSelectedGame(
                    (game) => ({
                      ...game,

                      reward_expiry_days:
                        Math.max(
                          1,
                          Number(
                            value
                          ) || 1
                        ),
                    })
                  )
                }
              />

            </div>

          </SectionCard>


          {/* ==================================================
              3 NUMBERS
          ================================================== */}

          {selectedGameKey ===
            "three_numbers" && (

            <SectionCard
              title="3 Numbers Reward"
              description="Configure the reward paid when all three numbers match."
            >

              <div
                className="
                  max-w-md
                "
              >

                <NumberField
                  label="Winning Reward"
                  hint="INR"
                  value={paiseToRupees(
                    threeNumbersReward
                  )}
                  min={0}
                  step={1}
                  onChange={
                    updateThreeNumbersReward
                  }
                />

              </div>


              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-violet-100
                  bg-violet-50
                  p-4
                "
              >

                <Trophy
                  size={17}
                  className="
                    mt-0.5
                    shrink-0
                    text-violet-600
                  "
                />


                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      text-violet-900
                    "
                  >
                    Winning rule
                  </p>


                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-violet-700
                    "
                  >
                    A reward is issued only when all
                    three server-generated numbers are
                    identical.
                  </p>

                </div>

              </div>

            </SectionCard>
          )}


          {/* ==================================================
              SCRATCH & WIN
          ================================================== */}

          {selectedGameKey ===
            "scratch_win" && (

            <SectionCard
              title="Scratch & Win Rewards"
              description="Configure reward amounts, labels and the exact probability of each outcome."
            >

              {/* ============================================
                  PROBABILITY SUMMARY
              ============================================= */}

              <div
                className="
                  mb-5
                  rounded-2xl
                  border
                  border-purple-100
                  bg-gradient-to-r
                  from-purple-50
                  via-white
                  to-pink-50
                  p-4
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  <div>

                    <p
                      className="
                        text-xs
                        font-bold
                        text-slate-900
                      "
                    >
                      Total Probability
                    </p>


                    <p
                      className="
                        mt-1
                        text-[11px]
                        leading-5
                        text-slate-500
                      "
                    >
                      All outcomes together must equal exactly
                      100%.
                    </p>

                  </div>


                  <div
                    className={`
                      inline-flex
                      items-center
                      justify-center
                      rounded-full
                      px-4
                      py-2
                      text-sm
                      font-black
                      ${
                        scratchProbabilityValid
                          ? "bg-emerald-100 text-emerald-700"
                          : scratchProbabilityTotal > 100
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }
                    `}
                  >
                    {scratchProbabilityTotal.toFixed(
                      2
                    )}
                    %
                  </div>

                </div>


                <div
                  className="
                    mt-4
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-white
                  "
                >

                  <div
                    className={`
                      h-full
                      rounded-full
                      transition-all
                      ${
                        scratchProbabilityValid
                          ? "bg-emerald-500"
                          : scratchProbabilityTotal > 100
                            ? "bg-red-500"
                            : "bg-purple-500"
                      }
                    `}
                    style={{
                      width: `${Math.min(
                        scratchProbabilityTotal,
                        100
                      )}%`,
                    }}
                  />

                </div>


                {!scratchProbabilityValid &&
                  scratchRewards.length > 0 && (
                    <p
                      className="
                        mt-3
                        text-[11px]
                        font-medium
                        text-amber-700
                      "
                    >
                      {scratchProbabilityTotal <
                      100
                        ? `Add ${(
                            100 -
                            scratchProbabilityTotal
                          ).toFixed(
                            2
                          )}% more probability.`
                        : `Reduce ${(
                            scratchProbabilityTotal -
                            100
                          ).toFixed(
                            2
                          )}% to reach 100%.`}
                    </p>
                  )}

              </div>


              {/* ============================================
                  REWARD ROWS
              ============================================= */}

              <div className="space-y-3">

                {scratchRewards.length ===
                  0 && (

                  <div
                    className="
                      rounded-2xl
                      border
                      border-dashed
                      border-slate-300
                      bg-slate-50
                      p-8
                      text-center
                    "
                  >

                    <Gift
                      size={28}
                      className="
                        mx-auto
                        text-slate-300
                      "
                    />


                    <p
                      className="
                        mt-3
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      No rewards configured
                    </p>


                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-400
                      "
                    >
                      Add your first reward outcome below.
                    </p>

                  </div>
                )}


                {scratchRewards.map(
                  (
                    reward,
                    index
                  ) => {

                    return (
                      <div
                        key={index}
                        className="
                          rounded-2xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-4
                        "
                      >

                        <div
                          className="
                            grid
                            gap-4
                            xl:grid-cols-[1.4fr_1fr_1fr_auto]
                          "
                        >

                          {/* ============================
                              LABEL
                          ============================= */}

                          <ScratchLabelField
                            value={
                              reward.label
                            }
                            onChange={(
                              value
                            ) => {

                              const updated =
                                [
                                  ...scratchRewards,
                                ];

                              updated[
                                index
                              ] = {
                                ...updated[
                                  index
                                ],
                                label:
                                  value,
                              };

                              updateScratchRewards(
                                updated
                              );

                            }}
                          />


                          {/* ============================
                              AMOUNT
                          ============================= */}

                          <div>

                            <FieldLabel
                              hint="Max ₹10 for now"
                            >
                              Reward Amount
                            </FieldLabel>


                            <div
                              className="
                                relative
                              "
                            >

                              <span
                                className="
                                  absolute
                                  left-3
                                  top-1/2
                                  -translate-y-1/2
                                  text-xs
                                  font-semibold
                                  text-slate-400
                                "
                              >
                                ₹
                              </span>


                              <input
                                type="number"
                                min={0}
                                max={10}
                                step={1}
                                value={paiseToRupees(
                                  reward.amount_paise
                                )}
                                onChange={(
                                  event
                                ) => {

                                  const updated =
                                    [
                                      ...scratchRewards,
                                    ];


                                  const amount =
                                    Math.min(
                                      10,
                                      Math.max(
                                        0,
                                        Number(
                                          event
                                            .target
                                            .value
                                        ) || 0
                                      )
                                    );


                                  updated[
                                    index
                                  ] = {
                                    ...updated[
                                      index
                                    ],
                                    amount_paise:
                                      rupeesToPaise(
                                        String(
                                          amount
                                        )
                                      ),
                                  };


                                  if (
                                    amount ===
                                    0
                                  ) {

                                    updated[
                                      index
                                    ] = {
                                      ...updated[
                                        index
                                      ],
                                      label:
                                        "Better Luck Next Time",
                                    };

                                  }


                                  updateScratchRewards(
                                    updated
                                  );

                                }}
                                className="
                                  h-11
                                  w-full
                                  rounded-xl
                                  border
                                  border-slate-200
                                  bg-white
                                  pl-8
                                  pr-3
                                  text-sm
                                  font-medium
                                  text-slate-900
                                  outline-none
                                  focus:border-slate-400
                                  focus:ring-4
                                  focus:ring-slate-100
                                "
                              />

                            </div>

                          </div>


                          {/* ============================
                              PROBABILITY
                          ============================= */}

                          <div>

                            <FieldLabel hint="%">
                              Probability
                            </FieldLabel>


                            <div
                              className="
                                relative
                              "
                            >

                              <input
                                type="number"
                                min={0}
                                max={100}
                                step={0.01}
                                value={
                                  reward.probability
                                }
                                onChange={(
                                  event
                                ) => {

                                  const updated =
                                    [
                                      ...scratchRewards,
                                    ];


                                  const probability =
                                    Math.min(
                                      100,
                                      Math.max(
                                        0,
                                        Number(
                                          event
                                            .target
                                            .value
                                        ) || 0
                                      )
                                    );


                                  updated[
                                    index
                                  ] = {
                                    ...updated[
                                      index
                                    ],
                                    probability,
                                  };


                                  updateScratchRewards(
                                    updated
                                  );

                                }}
                                className="
                                  h-11
                                  w-full
                                  rounded-xl
                                  border
                                  border-slate-200
                                  bg-white
                                  px-3
                                  pr-8
                                  text-sm
                                  font-medium
                                  text-slate-900
                                  outline-none
                                  focus:border-slate-400
                                  focus:ring-4
                                  focus:ring-slate-100
                                "
                              />


                              <span
                                className="
                                  absolute
                                  right-3
                                  top-1/2
                                  -translate-y-1/2
                                  text-xs
                                  font-semibold
                                  text-slate-400
                                "
                              >
                                %
                              </span>

                            </div>

                          </div>


                          {/* ============================
                              REMOVE
                          ============================= */}

                          <div
                            className="
                              flex
                              items-end
                            "
                          >

                            <button
                              type="button"
                              onClick={() => {

                                const updated =
                                  scratchRewards.filter(
                                    (
                                      _,
                                      rewardIndex
                                    ) =>
                                      rewardIndex !==
                                      index
                                  );

                                updateScratchRewards(
                                  updated
                                );

                              }}
                              className="
                                flex
                                h-11
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-red-200
                                bg-white
                                px-3
                                text-xs
                                font-semibold
                                text-red-600
                                transition
                                hover:bg-red-50
                                xl:w-auto
                              "
                            >

                              <Trash2
                                size={15}
                              />

                              <span className="xl:hidden">
                                Remove Reward
                              </span>

                            </button>

                          </div>

                        </div>


                        {/* ============================
                            BETTER LUCK INDICATOR
                        ============================= */}

                        {reward.amount_paise ===
                          0 && (

                          <div
                            className="
                              mt-3
                              flex
                              items-center
                              gap-2
                              rounded-xl
                              border
                              border-slate-200
                              bg-white
                              px-3
                              py-2
                            "
                          >

                            <Sparkles
                              size={14}
                              className="
                                shrink-0
                                text-slate-400
                              "
                            />


                            <span
                              className="
                                text-[11px]
                                font-medium
                                text-slate-500
                              "
                            >
                              This is a{" "}

                              <span
                                className="
                                  font-bold
                                  text-slate-700
                                "
                              >
                                Better Luck Next Time
                              </span>{" "}

                              outcome.
                            </span>

                          </div>

                        )}

                      </div>
                    );
                  }
                )}

              </div>


              {/* ============================================
                  ADD REWARD
              ============================================= */}

              <button
                type="button"
                onClick={
                  addScratchReward
                }
                className="
                  mt-4
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-purple-200
                  bg-purple-50
                  px-4
                  text-xs
                  font-bold
                  text-purple-700
                  transition
                  hover:bg-purple-100
                "
              >

                <Plus
                  size={16}
                />

                Add Reward

              </button>


              {/* ============================================
                  INFORMATION
              ============================================= */}

              <div
                className="
                  mt-5
                  grid
                  gap-3
                  sm:grid-cols-2
                "
              >

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-purple-100
                    bg-purple-50
                    p-4
                  "
                >

                  <Sparkles
                    size={17}
                    className="
                      mt-0.5
                      shrink-0
                      text-purple-600
                    "
                  />


                  <div>

                    <p
                      className="
                        text-xs
                        font-semibold
                        text-purple-900
                      "
                    >
                      Server-side selection
                    </p>


                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        text-purple-700
                      "
                    >
                      The server decides the outcome using
                      the probabilities saved here.
                    </p>

                  </div>

                </div>


                <div
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-amber-100
                    bg-amber-50
                    p-4
                  "
                >

                  <Gift
                    size={17}
                    className="
                      mt-0.5
                      shrink-0
                      text-amber-600
                    "
                  />


                  <div>

                    <p
                      className="
                        text-xs
                        font-semibold
                        text-amber-900
                      "
                    >
                      Better Luck Next Time
                    </p>


                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        text-amber-700
                      "
                    >
                      Set the amount to ₹0 for a
                      non-winning outcome.
                    </p>

                  </div>

                </div>

              </div>


              {/* ============================================
                  CONFIGURATION STATUS
              ============================================= */}

              <div
                className={`
                  mt-5
                  rounded-xl
                  border
                  px-4
                  py-3
                  text-xs
                  font-semibold
                  ${
                    scratchConfigValid
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }
                `}
              >

                {scratchConfigValid ? (

                  <span
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <Check
                      size={15}
                    />

                    Scratch & Win configuration
                    is ready to save.

                  </span>

                ) : (

                  <span>
                    Complete the reward configuration
                    above before saving.
                  </span>

                )}

              </div>

            </SectionCard>
          )}


          {/* ==================================================
              DAILY POLL
          ================================================== */}

          {selectedGameKey ===
            "daily_poll" && (

            <>
              <SectionCard
                title="Daily Poll Reward"
                description="Configure the reward granted for participating in the daily poll."
              >

                <div
                  className="
                    grid
                    gap-5
                    sm:grid-cols-2
                  "
                >

                  <NumberField
                    label="Base Daily Reward"
                    hint="INR"
                    value={paiseToRupees(
                      dailyPoll.base_reward_paise
                    )}
                    min={0}
                    step={1}
                    onChange={(value) =>
                      updateDailyPoll(
                        (current) => ({
                          ...current,

                          base_reward_paise:
                            rupeesToPaise(
                              value
                            ),
                        })
                      )
                    }
                  />


                  <NumberField
                    label="Weekly Streak Reward"
                    hint="INR"
                    value={paiseToRupees(
                      dailyPoll.weekly_reward_paise
                    )}
                    min={0}
                    step={1}
                    onChange={(value) =>
                      updateDailyPoll(
                        (current) => ({
                          ...current,

                          weekly_reward_paise:
                            rupeesToPaise(
                              value
                            ),
                        })
                      )
                    }
                  />

                </div>

              </SectionCard>


              <SectionCard
                title="7-Day Streak Rewards"
                description="Set the reward associated with each consecutive day."
              >

                <div
                  className="
                    grid
                    gap-3
                    sm:grid-cols-2
                    xl:grid-cols-4
                  "
                >

                  {Array.from(
                    {
                      length: 7,
                    },
                    (_, index) => {

                      const day =
                        index + 1;

                      const key =
                        String(day);


                      return (
                        <div
                          key={key}
                          className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                          "
                        >

                          <div
                            className="
                              mb-3
                              flex
                              items-center
                              gap-2
                            "
                          >

                            <span
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                text-[11px]
                                font-bold
                                text-slate-700
                                shadow-sm
                              "
                            >
                              {day}
                            </span>


                            <span
                              className="
                                text-xs
                                font-semibold
                                text-slate-700
                              "
                            >
                              Day {day}
                            </span>

                          </div>


                          <div
                            className="
                              relative
                            "
                          >

                            <span
                              className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-xs
                                font-semibold
                                text-slate-400
                              "
                            >
                              ₹
                            </span>


                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={paiseToRupees(
                                dailyPoll
                                  .streak_rewards?.[
                                  key
                                ]
                              )}
                              onChange={(
                                event
                              ) =>
                                updateDailyPoll(
                                  (
                                    current
                                  ) => ({
                                    ...current,

                                    streak_rewards:
                                      {
                                        ...current.streak_rewards,

                                        [key]:
                                          rupeesToPaise(
                                            event
                                              .target
                                              .value
                                          ),
                                      },
                                  })
                                )
                              }
                              className="
                                h-10
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                pl-8
                                pr-3
                                text-sm
                                font-semibold
                                text-slate-900
                                outline-none
                                focus:border-slate-400
                                focus:ring-4
                                focus:ring-slate-100
                              "
                            />

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>


                <div
                  className="
                    mt-5
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-blue-100
                    bg-blue-50
                    p-4
                  "
                >

                  <Clock3
                    size={17}
                    className="
                      mt-0.5
                      shrink-0
                      text-blue-600
                    "
                  />


                  <div>

                    <p
                      className="
                        text-xs
                        font-semibold
                        text-blue-900
                      "
                    >
                      Streak behaviour
                    </p>


                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        text-blue-700
                      "
                    >
                      The game can use these seven values
                      to reward members for maintaining
                      their daily participation streak.
                    </p>

                  </div>

                </div>

              </SectionCard>
            </>
          )}


          {/* ==================================================
              SAVE BUTTON
          ================================================== */}

          <div
            className="
              sticky
              bottom-4
              z-10
              flex
              justify-end
            "
          >

            <button
              type="button"
              onClick={() =>
                void saveGame()
              }
              disabled={
                saving ||
                (
                  selectedGameKey ===
                    "scratch_win" &&
                  !scratchConfigValid
                )
              }
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-slate-950
                px-5
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-slate-950/10
                transition
                hover:bg-slate-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {saving ? (

                <>
                  <Loader2
                    size={17}
                    className="
                      animate-spin
                    "
                  />

                  Saving...
                </>

              ) : (

                <>
                  <Save
                    size={17}
                  />

                  Save{" "}
                  {
                    selectedGame.display_name
                  }
                </>

              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}