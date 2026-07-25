import { useState } from "react";

import {
  Users,
  Copy,
  Pencil,
  Plus,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";


import StatusBadge from "@/components/shared/StatusBadge";

import { Button } from "@/components/ui/button";


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


import ReferralDialog from "./ReferralDialog";


import {
  useCustomerReferral,
} from "../hooks/useReferral";


import {
  useReferralTransactions,
} from "../hooks/useReferralTransactions";


import {
  useCompleteReferralTransaction,
  useCancelReferralTransaction,
} from "../hooks/useReferralTransactionMutations";


import type {
  CustomerReferral,
} from "../types/referral.types";



interface CustomerReferralSectionProps {

  customerId: string;

}



export default function CustomerReferralSection({
  customerId,
}: CustomerReferralSectionProps) {


  const {
    data: referral,
    isLoading,
  } = useCustomerReferral(customerId);



  const {
    data: referralTransactions = [],
    isLoading: transactionsLoading,
  } = useReferralTransactions(customerId);



  const completeMutation =
    useCompleteReferralTransaction();


  const cancelMutation =
    useCancelReferralTransaction();



  const [dialogOpen, setDialogOpen] =
    useState(false);




  const handleCopy = () => {

    if (!referral?.referral_code)
      return;


    navigator.clipboard.writeText(
      referral.referral_code
    );

  };



  const handleComplete = (
    transaction: any
  ) => {

    completeMutation.mutate(
      transaction
    );

  };



  const handleCancel = (
    transaction: any
  ) => {

    cancelMutation.mutate(
      transaction.id
    );

  };



  if (isLoading) {

    return (

      <Card>

        <CardContent className="flex h-40 items-center justify-center">

          <Loader2 className="h-6 w-6 animate-spin" />

        </CardContent>

      </Card>

    );

  }



  return (

    <>

      <Card>

        <CardHeader>

          <div className="flex items-center justify-between">


            <CardTitle className="flex items-center gap-2">

              <Users className="h-5 w-5" />

              Referral Details

            </CardTitle>



            {
              referral ? (

                <Button

                  size="sm"

                  variant="outline"

                  onClick={() =>
                    setDialogOpen(true)
                  }

                >

                  <Pencil className="mr-2 h-4 w-4" />

                  Edit

                </Button>


              ) : (

                <Button

                  size="sm"

                  onClick={() =>
                    setDialogOpen(true)
                  }

                >

                  <Plus className="mr-2 h-4 w-4" />

                  Create

                </Button>

              )
            }


          </div>

        </CardHeader>




        <CardContent>


          {
            !referral ? (

              <p className="text-sm text-muted-foreground">
                No referral profile created yet.
              </p>


            ) : (

              <div className="space-y-6">



                {/* Referral Code */}

                <div className="rounded-lg border p-4">


                  <p className="text-sm text-muted-foreground">
                    Referral Code
                  </p>


                  <div className="mt-2 flex justify-between items-center">


                    <p className="font-semibold">

                      {referral.referral_code}

                    </p>



                    <Button

                      size="icon"

                      variant="ghost"

                      onClick={handleCopy}

                    >

                      <Copy className="h-4 w-4" />

                    </Button>


                  </div>


                </div>




                {/* Stats */}

                <div className="grid gap-4 md:grid-cols-2">


                  <div className="rounded-lg border p-4">

                    <p className="text-sm text-muted-foreground">
                      Total Referrals
                    </p>


                    <p className="text-2xl font-bold">

                      {referral.total_referrals}

                    </p>

                  </div>




                  <div className="rounded-lg border p-4">


                    <p className="text-sm text-muted-foreground">
                      Successful Referrals
                    </p>


                    <p className="text-2xl font-bold">

                      {referral.successful_referrals}

                    </p>


                  </div>


                </div>





                {/* Referral Transactions */}


                <div className="space-y-3">


                  <h3 className="font-semibold">
                    Referred Customers
                  </h3>



                  {
                    transactionsLoading ? (

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">

                        <Loader2 className="h-4 w-4 animate-spin" />

                        Loading referrals...

                      </div>


                    ) : referralTransactions.length === 0 ? (

                      <div className="rounded-lg border p-4 text-sm text-muted-foreground">

                        No referral activity yet.

                      </div>


                    ) : (


                      <div className="space-y-3">


                        {
                          referralTransactions.map(
                            (transaction) => (

                              <div

                                key={transaction.id}

                                className="rounded-lg border p-4 space-y-4"

                              >


                                <div className="flex justify-between">


                                  <div>


                                    <p className="font-medium">

                                      {
                                        transaction
                                          .referred_customer
                                          ?.first_name
                                      }{" "}

                                      {
                                        transaction
                                          .referred_customer
                                          ?.last_name
                                      }


                                    </p>



                                    <p className="text-sm text-muted-foreground">

                                      {
                                        transaction
                                          .referred_customer
                                          ?.email ||
                                        transaction
                                          .referred_customer
                                          ?.phone
                                      }

                                    </p>


                                  </div>




                                  <div className="flex flex-col items-end gap-2">


                                    <StatusBadge

                                      status={
                                        transaction.status
                                      }

                                    />



                                    {
                                      transaction.status === "pending" && (

                                        <div className="flex gap-2">


                                          <Button

                                            size="sm"

                                            variant="outline"

                                            onClick={() =>
                                              handleComplete(transaction)
                                            }

                                            disabled={
                                              completeMutation.isPending
                                            }

                                          >

                                            <CheckCircle className="mr-1 h-4 w-4" />

                                            Complete

                                          </Button>



                                          <Button

                                            size="sm"

                                            variant="destructive"

                                            onClick={() =>
                                              handleCancel(transaction)
                                            }

                                            disabled={
                                              cancelMutation.isPending
                                            }

                                          >

                                            <XCircle className="mr-1 h-4 w-4" />

                                            Cancel

                                          </Button>


                                        </div>

                                      )
                                    }


                                  </div>


                                </div>





                                <div className="flex justify-between text-sm">


                                  <span className="text-muted-foreground">
                                    Reward Points
                                  </span>


                                  <span className="font-medium">

                                    {transaction.reward_points}

                                  </span>


                                </div>



                              </div>

                            )
                          )
                        }


                      </div>

                    )
                  }


                </div>



              </div>

            )
          }


        </CardContent>

      </Card>




      <ReferralDialog

        open={dialogOpen}

        onOpenChange={setDialogOpen}

        customerId={customerId}

        referral={
          referral as CustomerReferral
        }

      />


    </>

  );

}