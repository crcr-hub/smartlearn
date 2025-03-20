import AreaCard from "../areaCards/AreaCard";
import "./AreaCards.scss";
const AreaCards = ({cardInfo}) => {
  const currentHour = new Date().getHours();
  const percentageOfDayPassed = Math.round((currentHour / 24) * 100);
  const hoursAchieved = currentHour; // Hours completed
  const hoursRemaining = 24 - currentHour; // Hours left in the day

    return (
      <section className="content-area-cards">
         <AreaCard
                  colors={["#e4e8ef", "#475be8"]}
                  percentFillValue={percentageOfDayPassed}
                  tooltipText={`Achieved: ${hoursAchieved} hrs, Remaining: ${hoursRemaining} hrs`}
                  cardInfo={{
                    title: "Todays Revenue",
                    value:`₹${cardInfo?.today_revenue || "0.00"}`,
                    text: "We have sold 123 items.",
                  }}
                />
             <AreaCard
                      colors={["#e4e8ef", "#4ce13f"]}
                      percentFillValue={50}
                      cardInfo={{
                        title: "This Week Revenue",
                        value: `₹${cardInfo?.last_week_revenue || "0.00"}`,
                        text: "t",
                      }}
                    />
                    <AreaCard
                             colors={["#e4e8ef", "#f29a2e"]}
                             percentFillValue={40}
                             cardInfo={{
                               title: "This Month Revenue",
                               value: `₹${cardInfo?.this_month || "0.00"}`,
                               text: "",
                             }}
                           />
      </section>
    );
  };
  
  export default AreaCards;