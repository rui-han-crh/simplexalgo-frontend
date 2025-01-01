import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "@/components/ui/breadcrumb"

type BreadcrumbBarProps = {
  linkList: {
    name: string;
    url: string;
  }[]
}


export default function BreadcrumbBar(props: BreadcrumbBarProps) {
  return (
    <BreadcrumbRoot>
      {props.linkList.map((link, index) => {
        return index === props.linkList.length - 1 
        ? <BreadcrumbCurrentLink key={index}>{link.name}</BreadcrumbCurrentLink>
        : <BreadcrumbLink key={index} href={link.url}>{link.name}</BreadcrumbLink>
      })}
    </BreadcrumbRoot>
  )
}