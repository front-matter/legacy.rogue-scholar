import Image from "next/image"
import Link from "next/link"

export function KofiButton({ username, label, title }) {
  const profile_url = "https://ko-fi.com/" + username

  return (
    <div className="flex flex-shrink-0 items-center">
      <Link className="" href={profile_url} target="_blank" title={title}>
        <Image
          className="inline"
          src="/ko-fi.png"
          width={24}
          height={17}
          alt=""
        />
        {label && <span className="ml-1 mr-5 text-base">{label}</span>}
      </Link>
    </div>
  )
}
