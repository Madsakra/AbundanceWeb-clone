
type AdminTableHeaderType = {
    header:string,
}


export default function AdminTableHeader({header}:AdminTableHeaderType) {
  return (
    <h1 className="text-2xl my-4 md:my-0 font-medium text-[#656363]">{header}</h1>
  )
}
