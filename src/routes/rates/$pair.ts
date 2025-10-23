import { createFileRoute } from "@tanstack/react-router"

const googleFinUrl = 'https://google.com/finance/quote'
const googleRateRegex = /data-last-price="([\d.]+)"/g

export const Route = createFileRoute('/rates/$pair')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { pair } = params
        const res = await fetch(`${googleFinUrl}/${pair}`)
        const html = await res.text()
        const execResult = googleRateRegex.exec(html)
        const $rate = execResult?.at(1)
        if ($rate === undefined) {
          return new Response(html, {
            status: 502,
          })
        }
        const rate = parseFloat($rate)
        return new Response(JSON.stringify({ rate }), {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      },
    },
  },
})
