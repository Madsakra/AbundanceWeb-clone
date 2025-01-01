


type ReviewCardProps = {
    avatar:string;
    name:string;
    score:number;
    reviews:string[];

}





export default function AppReviewCard({avatar,name,score,reviews}:ReviewCardProps) {
  return (
    <div className="w-full md:w-96 h-auto shadow-2xl flex flex-col p-8 rounded-2xl" >


        <div className="flex flex-row gap-5">
            <img src={avatar} className="w-20 h-20 rounded-full"/>
            
            <div className="flex flex-col gap-2">
   
            <h2 className="text-xl font-bold">{name}</h2>
            <StarRating score={score} />
            <h4>Given {score}/5</h4>
            </div>
        </div>

        <div className="flex flex-col gap-2 mt-10">
        {reviews.map((review,index)=>(
            <div key={index} className="border-2 h-auto w-full p-2 rounded-lg flex-shrink">
                <h1 className="text-sm">{review}</h1>
            </div>
        ))}
        </div>



    </div>
  )
}





// StarRating Component
function StarRating({ score }: { score: number }) {
    const totalStars = 5;
    const stars = [];
  
    for (let i = 0; i < totalStars; i++) {
      const fillPercentage = Math.min(Math.max(score - i, 0), 1) * 100; // Determines how much of the star is filled
      stars.push(
        <div className="relative w-6 h-6" key={i}>
          {/* Empty star */}
          <div className="absolute top-0 left-0 w-full h-full bg-gray-300 clip-star"></div>
          {/* Filled star */}
          <div
            className="absolute top-0 left-0 h-full bg-[#00ACAC] clip-star"
            style={{ width: `${fillPercentage}%` }}
          ></div>
        </div>
      );
    }
  
    return <div className="flex space-x-1">{stars}</div>;
  }