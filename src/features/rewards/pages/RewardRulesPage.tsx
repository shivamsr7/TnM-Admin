import RewardRulesForm from "../components/RewardRulesForm";

export default function RewardRulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Reward Rules
        </h1>

        <p className="text-muted-foreground">
          Configure how customers earn and redeem reward points.
        </p>
      </div>

      <RewardRulesForm />
    </div>
  );
}