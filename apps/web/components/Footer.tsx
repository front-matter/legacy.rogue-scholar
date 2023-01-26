import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import {
  faGithub,
  faMastodon,
  faDiscord
} from '@fortawesome/free-brands-svg-icons'

import { Container } from '../components/Container'
import { NavLink } from '../components/NavLink'

import Icon from '../images/icon.png'

export function Footer() {
  return (
    <footer className="bg-slate-100">
      <Container className="relative">
        <div className="py-8">
          <div className="text-blue-600 text-2xl font-semibold flex justify-center">
            <Image src={Icon} alt="Icon" width={18} className="mr-2" /> The Rogue Scholar
          </div>
          <nav className="mt-10 text-sm" aria-label="quick links">
            <div className="-my-1 flex justify-center gap-x-6">
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#faq">FAQ</NavLink>
              <NavLink href="https://docs.rogue-scholar.org">Docs</NavLink>
              <NavLink href="https://plausible.io/rogue-scholar.org">Usage Stats</NavLink>
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6">
            <Link href='mailto:info..front-matter.io' className='text-lg text-gray-500 hover:text-gray-400 border-b-0'>
              <span className='sr-only'>Mail</span>
              <FontAwesomeIcon icon={faEnvelope} />
            </Link>
            <Link href='https://discord.gg/HvbD4dNPFh' className='text-lg text-gray-500 hover:text-gray-400 border-b-0'>
              <span className='sr-only'>Discord</span>
              <FontAwesomeIcon icon={faDiscord} />
            </Link>
            <Link href='https://hachyderm.io/..mfenner' className='text-lg text-gray-500 hover:text-gray-400 border-b-0'>
              <span className='sr-only'>Mastodon</span>
              <FontAwesomeIcon icon={faMastodon} />
            </Link>
            <Link href='https://github.com/front-matter/rogue-scholar' className='text-lg text-gray-500 hover:text-gray-400 border-b-0'>
              <span className='sr-only'>GitHub</span>
              <FontAwesomeIcon icon={faGithub} />
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500 sm:mt-0">
            Copyright &copy; {new Date().getFullYear()} The Rogue Scholar. All rights
            reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
