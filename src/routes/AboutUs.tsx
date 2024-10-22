import youfuImg from '../assets/Images/youfu-img.png'
import jaydenImg from '../assets/Images/JaydenImg.png'
import litongImg from '../assets/Images/LitongImg.png'
import rayImg from '../assets/Images/RayImg.png'
import hongjunImg from '../assets/Images/HongJunImg.png'
import TeamDetailsCard from '@/customizedComponents/TeamDetailsCard'

export default function AboutUs() {
  
  const TeamDetails = [
    {
        image:youfuImg,
        name:"Han YouFu",
        role:"Leader"
    },{
        image:jaydenImg,
        name:'Kyaw Za Yan Naing (Jayden)',
        role:''
    },{
        image:litongImg,
        name:'Li Tong',
        role:''
    },{
        image:rayImg,
        name:'Ray Lim Jing Han',
        role:''
    },{
        image:hongjunImg,
        name:'Yeo Hong Jun (Colin)',
        role:''
    }
  ]
  
  
  
  
    return (
    <div>
        <div className="w-full h-[15vh] flex justify-center items-center">
            <h1 className="text-4xl lg:text-6xl font-bold">About us</h1>
        </div>


        <div className="w-full  bg-[#00ACAC] rounded-lg flex flex-col items-center py-10">
        <h1 className="text-4xl lg:text-6xl font-bold text-white h-[20%] ">Meet Our Team</h1>


        {/*Card Container*/}
        <div className="h-auto  w-full grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 xl:w-[80%] justify-items-center items-center mt-14 ">

            {TeamDetails.map((member,index)=>(
                <TeamDetailsCard key={index} image={member.image} name={member.name} title={member.role} />
            ))}

        </div>


        </div>


    </div>
  )
}
