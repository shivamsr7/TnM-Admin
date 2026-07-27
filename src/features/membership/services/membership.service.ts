import { supabase } from "@/lib/supabase";

import type { Membership } from "../types";


class MembershipService {


async getRewardHistory(customerId: string) {

  const { data, error } = await supabase
    .from("reward_transactions")
    .select(`
      id,
      transaction_type,
      points,
      description,
      created_at
    `)
    .eq("customer_id", customerId)
    .order("created_at", {
      ascending: false,
    });


  if (error) {
    throw error;
  }


  return data ?? [];

}







async getMembers(): Promise<Membership[]> {


  const { data: tiers, error: tierError } =
    await supabase
      .from("reward_tiers")
      .select(`
        id,
        tier_name,
        badge_color,
        minimum_spend,
        benefits,
        sort_order
      `)
      .eq("is_active", true)
      .order("sort_order", {
        ascending: true,
      });



  if (tierError)
    throw tierError;








  const { data, error } =
    await supabase
      .from("customer_rewards")
      .select(`
        customer_id,
        current_points,
        lifetime_spend,

        customer:customers(
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .order("lifetime_spend", {
        ascending:false,
      });




  if(error)
    throw error;







  return (data ?? []).map(
    (item:any):Membership => {



    const currentSpend =
      Number(item.lifetime_spend ?? 0);




    /*
      Calculate tier from spend
    */

    let currentTier =
      tiers?.[0] ?? null;


    let currentTierIndex = 0;



    tiers?.forEach(
      (tier,index)=>{


        const tierSpend =
          Number(
            tier.minimum_spend
          );


        if(currentSpend >= tierSpend){

          currentTier = tier;

          currentTierIndex = index;

        }


      }
    );







    const nextTier =
      tiers &&
      currentTierIndex <
      tiers.length - 1

      ?

      tiers[currentTierIndex + 1]

      :

      null;







    let progress = 100;

    let amountToNextTier = 0;





    if(nextTier){


      const currentMin =
        Number(
          currentTier?.minimum_spend ?? 0
        );


      const nextMin =
        Number(
          nextTier.minimum_spend
        );



      progress =
        Math.round(
          (
            (currentSpend - currentMin)
            /
            (nextMin - currentMin)
          )
          *
          100
        );



      progress =
        Math.max(
          0,
          Math.min(
            progress,
            100
          )
        );



      amountToNextTier =
        Math.max(
          0,
          nextMin - currentSpend
        );


    }









    return {


      customer_id:
        item.customer_id,



      customer_name:
        `${item.customer?.first_name ?? ""} ${
          item.customer?.last_name ?? ""
        }`.trim(),



      customer_email:
        item.customer?.email ?? null,



      customer_phone:
        item.customer?.phone ?? null,



      tier_id:
        currentTier?.id ?? null,



      tier_name:
        currentTier?.tier_name ?? "Silver",



      badge_color:
        currentTier?.badge_color ?? "#6B7280",



      benefits:
        currentTier?.benefits ?? null,



      current_points:
        Number(
          item.current_points ?? 0
        ),



      lifetime_spend:
        currentSpend,



      progress,



      amount_to_next_tier:
        amountToNextTier,



      next_tier:
        nextTier
        ?

        {
          id:
            nextTier.id,

          tier_name:
            nextTier.tier_name,

          minimum_spend:
            Number(
              nextTier.minimum_spend
            ),
        }

        :

        null,


    };



  });


}









async getMembershipStats(){


const [members,tiersResult] =
await Promise.all([

  this.getMembers(),


  supabase
    .from("reward_tiers")
    .select(`
      id,
      tier_name,
      badge_color,
      sort_order
    `)
    .eq("is_active",true)
    .order("sort_order",{
      ascending:true,
    }),

]);



if(tiersResult.error)
 throw tiersResult.error;



const tiers =
tiersResult.data ?? [];




return {


totalMembers:
members.length,



totalRewardPoints:
members.reduce(
(sum,member)=>
sum + member.current_points,
0
),



totalLifetimeSpend:
members.reduce(
(sum,member)=>
sum + member.lifetime_spend,
0
),



averageLifetimeSpend:
members.length > 0

?

Math.round(
members.reduce(
(sum,member)=>
sum + member.lifetime_spend,
0
)
/
members.length
)

:

0,



tiers:
tiers.map((tier)=>({

id:
tier.id,


tier_name:
tier.tier_name,


badge_color:
tier.badge_color,


members:
members.filter(
(member)=>
member.tier_id === tier.id
).length,


})),


};


}









async getMember(
customerId:string
):Promise<Membership>{


const members =
await this.getMembers();



const member =
members.find(
(m)=>
m.customer_id === customerId
);



if(!member){

throw new Error(
"Member not found"
);

}



return member;


}



}



export const membershipService =
new MembershipService();