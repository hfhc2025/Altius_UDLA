/**
 * Define la fuente Inter como variable CSS (--font-inter)
 * usando next/font/google.  Se importa una única vez y se
 * consume donde la necesites.
 */
import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // ➜ genera la clase __variable_xxxx
  display: 'swap',
})