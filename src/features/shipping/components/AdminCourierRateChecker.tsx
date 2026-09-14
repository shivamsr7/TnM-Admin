import {
  Clock3,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Truck,
} from "lucide-react";

import { useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";


interface Courier {
  id?: number | string;
  courier_company_id?: number | string;
  courier_name?: string;
  rate?: number | string;
  estimated_delivery_days?: string | number;
  etd?: string;
  rating?: number | string;
  delivery_performance?: number | string;
  cod?: number;
  cod_charges?: number | string;
  mode?: number | string;
  is_surface?: boolean;
  is_hyperlocal?: boolean;
  blocked?: number;
}


interface AdminCourierRateCheckerProps {
  defaultWeight?: number;
}


export default function AdminCourierRateChecker({
  defaultWeight = 0.5,
}: AdminCourierRateCheckerProps) {

  const [pincode, setPincode] = useState("");
  const [weight, setWeight] = useState(
    String(defaultWeight)
  );

  const [paymentMode, setPaymentMode] =
    useState<"prepaid" | "cod">("prepaid");

  const [couriers, setCouriers] =
    useState<Courier[]>([]);

  const [searchedPincode, setSearchedPincode] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);


  /*
   * =========================================================
   * CHECK COURIER RATES
   * =========================================================
   *
   * Admin-only functionality.
   *
   * IMPORTANT:
   * This component intentionally calls the existing
   * `check-delivery` Supabase Edge Function directly.
   *
   * It does NOT modify:
   * - customer DeliveryChecker
   * - customer useDeliveryCheck hook
   * - customer shipping service
   * - checkout flow
   * - cart flow
   */

  const checkCourierRates = async () => {

    const cleanPincode =
      pincode.replace(/\D/g, "");

    if (!/^\d{6}$/.test(cleanPincode)) {

      setErrorMessage(
        "Please enter a valid 6-digit customer pincode."
      );

      setCouriers([]);

      return;
    }


    const numericWeight =
      Number(weight);

    if (
      !Number.isFinite(numericWeight) ||
      numericWeight <= 0
    ) {

      setErrorMessage(
        "Please enter a valid shipment weight."
      );

      setCouriers([]);

      return;
    }


    setIsLoading(true);
    setErrorMessage("");
    setCouriers([]);


    try {

      const {
        data,
        error,
      } = await supabase.functions.invoke(
        "check-delivery",
        {
          body: {
            customer_pincode:
              cleanPincode,

            weight:
              numericWeight,

            payment_method:
              paymentMode,
          },
        }
      );


      if (error) {
        throw error;
      }


      /*
       * Shiprocket returns courier options under
       * `available_courier_companies`.
       */

      const availableCouriers =
        Array.isArray(
          data?.data?.available_courier_companies
        )
          ? data.data.available_courier_companies
          : [];


      const filteredCouriers =
        availableCouriers
          .filter(
            (courier: Courier) =>
              courier?.blocked !== 1
          )
          .sort(
            (
              a: Courier,
              b: Courier
            ) =>
              Number(a?.rate ?? Infinity) -
              Number(b?.rate ?? Infinity)
          );


      setCouriers(
        filteredCouriers
      );

      setSearchedPincode(
        cleanPincode
      );


      if (
        filteredCouriers.length === 0
      ) {

        setErrorMessage(
          "No courier is currently available for this pincode."
        );

      }

    } catch (error) {

      console.error(
        "Admin courier rate check failed:",
        error
      );

      setCouriers([]);
      setSearchedPincode("");

      setErrorMessage(
        "Unable to fetch courier rates. Please try again."
      );

    } finally {

      setIsLoading(false);

    }

  };


  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  const formatAmount = (
    value: unknown
  ) => {

    const amount =
      Number(value ?? 0);

    if (!Number.isFinite(amount)) {
      return "—";
    }

    return `₹${amount.toFixed(2)}`;

  };


  const getDeliveryText = (
    courier: Courier
  ) => {

    if (
      courier?.estimated_delivery_days
    ) {

      return `${courier.estimated_delivery_days} days`;

    }

    if (courier?.etd) {
      return courier.etd;
    }

    return "—";

  };


  const getModeText = (
    courier: Courier
  ) => {

    if (
      courier?.is_hyperlocal
    ) {
      return "Hyperlocal";
    }

    if (
      courier?.is_surface ||
      Number(courier?.mode) === 0
    ) {
      return "Surface";
    }

    return "Air";

  };


  const cheapestCourierId =
    useMemo(() => {

      if (
        couriers.length === 0
      ) {
        return null;
      }


      const cheapest =
        couriers.reduce(
          (
            current,
            courier
          ) => {

            return Number(
              courier?.rate ??
              Infinity
            ) <
              Number(
                current?.rate ??
                Infinity
              )
              ? courier
              : current;

          },
          couriers[0]
        );


      return (
        cheapest?.id ??
        cheapest?.courier_company_id ??
        null
      );

    }, [couriers]);


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (

    <section
      className="
        w-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-[0_18px_50px_rgba(15,23,42,0.08)]
        md:p-7
      "
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#D4AF37]/10
              text-[#D4AF37]
            "
          >
            <Truck size={20} />
          </div>

          <div>

            <h2
              className="
                text-lg
                font-semibold
                tracking-tight
                text-slate-900
              "
            >
              Courier Rate Checker
            </h2>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-500
              "
            >
              Check courier availability and shipping charges for any customer pincode.
            </p>

          </div>

        </div>


        {searchedPincode && (

          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-1.5
              rounded-full
              border
              border-[#D4AF37]/20
              bg-[#D4AF37]/5
              px-3
              py-1.5
              text-xs
              font-medium
              text-[#D4AF37]
            "
          >
            <MapPin size={13} />
            {searchedPincode}
          </div>

        )}

      </div>


      {/* =====================================================
          SEARCH CONTROLS
      ====================================================== */}

      <div
        className="
          mt-6
          grid
          gap-3
          md:grid-cols-[1.5fr_0.65fr_0.75fr_auto]
          md:items-end
        "
      >

        {/* PINCODE */}

        <label>

          <span
            className="
              mb-2
              block
              text-xs
              font-medium
              text-slate-600
            "
          >
            Customer Pincode
          </span>

          <div className="relative">

            <MapPin
              size={17}
              className="
                pointer-events-none
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />

            <input
              type="text"
              value={pincode}
              onChange={(event) =>
                setPincode(
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              onKeyDown={(event) => {

                if (
                  event.key === "Enter"
                ) {
                  void checkCourierRates();
                }

              }}
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit pincode"
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-4
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-[#D4AF37]/60
                focus:ring-2
                focus:ring-[#D4AF37]/10
              "
            />

          </div>

        </label>


        {/* WEIGHT */}

        <label>

          <span
            className="
              mb-2
              block
              text-xs
              font-medium
              text-slate-600
            "
          >
            Weight (kg)
          </span>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={weight}
            onChange={(event) =>
              setWeight(
                event.target.value
              )
            }
            className="
              h-12
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              text-sm
              text-slate-900
              outline-none
              transition
              focus:border-[#D4AF37]/60
              focus:ring-2
              focus:ring-[#D4AF37]/10
            "
          />

        </label>


        {/* PAYMENT */}

        <label>

          <span
            className="
              mb-2
              block
              text-xs
              font-medium
              text-slate-600
            "
          >
            Payment
          </span>

          <select
            value={paymentMode}
            onChange={(event) =>
              setPaymentMode(
                event.target.value as
                  | "prepaid"
                  | "cod"
              )
            }
            className="
              h-12
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              text-sm
              text-slate-900
              outline-none
              focus:border-[#D4AF37]/60
              focus:ring-2
              focus:ring-[#D4AF37]/10
            "
          >

            <option value="prepaid">
              Prepaid
            </option>

            <option value="cod">
              COD
            </option>

          </select>

        </label>


        {/* SEARCH */}

        <button
          type="button"
          onClick={() =>
            void checkCourierRates()
          }
          disabled={isLoading}
          className="
            flex
            h-12
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#D4AF37]
            px-6
            text-sm
            font-semibold
            text-black
            transition-all
            duration-200
            hover:bg-[#e5c45a]
            hover:shadow-[0_8px_25px_rgba(212,175,55,0.15)]
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >

          {isLoading ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />
              Checking
            </>
          ) : (
            <>
              <Search size={17} />
              Check Rates
            </>
          )}

        </button>

      </div>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {errorMessage && (

        <div
          className="
            mt-4
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
          "
        >
          {errorMessage}
        </div>

      )}


      {/* =====================================================
          RESULTS
      ====================================================== */}

      {couriers.length > 0 && (

        <div className="mt-7">

          <div
            className="
              mb-4
              flex
              flex-col
              gap-2
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >

            <div>

              <div className="flex items-center gap-2">

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-slate-900
                  "
                >
                  Available Couriers
                </h3>

                <span
                  className="
                    rounded-full
                    bg-slate-100
                    px-2
                    py-0.5
                    text-[10px]
                    font-semibold
                    text-slate-600
                  "
                >
                  {couriers.length}
                </span>

              </div>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                {weight} kg ·{" "}
                {paymentMode === "cod"
                  ? "COD"
                  : "Prepaid"}{" "}
                · sorted by lowest shipping rate
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                void checkCourierRates()
              }
              disabled={isLoading}
              className="
                inline-flex
                w-fit
                items-center
                gap-1.5
                text-xs
                font-medium
                text-slate-600
                transition
                hover:text-[#D4AF37]
                disabled:opacity-50
              "
            >
              <RefreshCw size={13} />
              Refresh rates
            </button>

          </div>


          {/* =================================================
              DESKTOP TABLE
          ================================================== */}

          <div
            className="
              hidden
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-[0_10px_30px_rgba(15,23,42,0.04)]
              md:block
            "
          >

            <table
              className="
                w-full
                table-fixed
                border-collapse
              "
            >

              <colgroup>
                <col className="w-[40%]" />
                <col className="w-[18%]" />
                <col className="w-[20%]" />
                <col className="w-[22%]" />
              </colgroup>

              <thead>

                <tr
                  className="
                    border-b
                    border-slate-200
                    bg-slate-50/90
                  "
                >

                  <th
                    className="
                      px-5
                      py-3.5
                      text-left
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Courier
                  </th>

                  <th
                    className="
                      px-4
                      py-3.5
                      text-left
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Mode
                  </th>

                  <th
                    className="
                      px-4
                      py-3.5
                      text-left
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Delivery
                  </th>

                  <th
                    className="
                      px-5
                      py-3.5
                      text-right
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Shipping Amount
                  </th>

                </tr>

              </thead>


              <tbody>

                {couriers.map(
                  (
                    courier,
                    index
                  ) => {

                    const courierId =
                      courier?.id ??
                      courier?.courier_company_id;

                    const isCheapest =
                      courierId ===
                      cheapestCourierId;

                    return (

                      <tr
                        key={`${courierId}-${index}`}
                        className="
                          border-b
                          border-slate-100
                          last:border-b-0
                          transition-colors
                          hover:bg-slate-50
                        "
                      >

                        {/* COURIER */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-[#D4AF37]/10
                                text-[#D4AF37]
                              "
                            >
                              <Truck size={16} />
                            </div>

                            <div className="min-w-0">

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-2
                                "
                              >

                                <p
                                  className="
                                    truncate
                                    text-sm
                                    font-medium
                                    text-slate-900
                                  "
                                >
                                  {courier?.courier_name ||
                                    "Unknown Courier"}
                                </p>

                                {isCheapest && (

                                  <span
                                    className="
                                      shrink-0
                                      rounded-full
                                      bg-emerald-500/10
                                      px-2
                                      py-0.5
                                      text-[9px]
                                      font-bold
                                      tracking-wide
                                      text-emerald-400
                                    "
                                  >
                                    LOWEST
                                  </span>

                                )}

                              </div>

                              {courier?.courier_company_id && (

                                <p
                                  className="
                                    mt-0.5
                                    text-[10px]
                                    text-slate-400
                                  "
                                >
                                  Courier ID{" "}
                                  {courier.courier_company_id}
                                </p>

                              )}

                            </div>

                          </div>

                        </td>


                        {/* MODE */}

                        <td
                          className="
                            px-4
                            py-4
                            text-sm
                            text-slate-700
                          "
                        >
                          {getModeText(courier)}
                        </td>


                        {/* DELIVERY */}

                        <td className="px-4 py-4">

                          <div
                            className="
                              flex
                              items-center
                              gap-1.5
                              text-sm
                              text-slate-700
                            "
                          >

                            <Clock3
                              size={14}
                              className="text-slate-500"
                            />

                            {getDeliveryText(
                              courier
                            )}

                          </div>

                        </td>


                        {/* RATE */}

                        <td
                          className="
                            px-5
                            py-3.5
                            text-right
                            align-middle
                          "
                        >
                          <div
                            className="
                              ml-auto
                              w-fit
                              min-w-[132px]
                              rounded-xl
                              border
                              border-[#D4AF37]/20
                              bg-[#D4AF37]/[0.07]
                              px-3
                              py-2
                            "
                          >
                            <p
                              className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-slate-500
                              "
                            >
                              Shipping
                            </p>

                            <p
                              className="
                                mt-0.5
                                whitespace-nowrap
                                text-base
                                font-bold
                                tracking-tight
                                text-slate-950
                              "
                            >
                              {formatAmount(
                                courier?.rate
                              )}
                            </p>

                            {Number(
                              courier?.cod_charges ??
                              0
                            ) > 0 && (
                              <p
                                className="
                                  mt-0.5
                                  whitespace-nowrap
                                  text-[10px]
                                  font-medium
                                  text-slate-500
                                "
                              >
                                + {formatAmount(
                                  courier.cod_charges
                                )} COD
                              </p>
                            )}
                          </div>
                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>


          {/* =================================================
              MOBILE
          ================================================== */}

          <div
            className="
              space-y-3
              md:hidden
            "
          >

            {couriers.map(
              (
                courier,
                index
              ) => {

                const courierId =
                  courier?.id ??
                  courier?.courier_company_id;

                const isCheapest =
                  courierId ===
                  cheapestCourierId;

                return (

                  <div
                    key={`${courierId}-${index}`}
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-4
                      shadow-[0_8px_24px_rgba(15,23,42,0.05)]
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#D4AF37]/10
                            text-[#D4AF37]
                          "
                        >
                          <Truck size={17} />
                        </div>

                        <div className="min-w-0">

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >

                            <p
                              className="
                                truncate
                                text-sm
                                font-semibold
                                text-white
                              "
                            >
                              {courier?.courier_name ||
                                "Unknown Courier"}
                            </p>

                            {isCheapest && (
                              <span
                                className="
                                  text-[9px]
                                  font-bold
                                  text-emerald-400
                                "
                              >
                                LOWEST
                              </span>
                            )}

                          </div>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-500
                            "
                          >
                            {getModeText(courier)}
                          </p>

                        </div>

                      </div>


                      <div
                        className="
                          shrink-0
                          text-right
                        "
                      >

                        <p
                          className="
                            text-lg
                            font-bold
                            tracking-tight
                            text-slate-950
                          "
                        >
                          {formatAmount(
                            courier?.rate
                          )}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[10px]
                            text-slate-400
                          "
                        >
                          Shipping
                        </p>

                      </div>

                    </div>


                    <div
                      className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-2
                      "
                    >

                      <div
                        className="
                          rounded-xl
                          border
                          border-slate-100
                          bg-slate-50
                          px-3
                          py-2.5
                        "
                      >

                        <p
                          className="
                            text-[10px]
                            text-slate-400
                          "
                        >
                          Delivery
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-700
                          "
                        >
                          {getDeliveryText(
                            courier
                          )}
                        </p>

                      </div>


                    </div>

                  </div>

                );

              }
            )}

          </div>

        </div>

      )}

    </section>

  );
}
