
type TableHeaderBarProps = {
    mainText:string,
    subText:string,
}



export default function TableHeaderBar({mainText,subText}:TableHeaderBarProps) {
  return (
           
              <div className="flex flex-col gap-1">
              <h2 className="text-4xl">{mainText}</h2>
              <h3>{subText}</h3>
              </div>
  )
}
