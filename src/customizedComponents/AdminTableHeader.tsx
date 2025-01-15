
type AdminTableHeaderType = {
    header:string,
}


export default function AdminTableHeader({header}:AdminTableHeaderType) {
  return (
    <h1 className=" font-medium text-lg text-[#656363]">{header}</h1>
  )
}
