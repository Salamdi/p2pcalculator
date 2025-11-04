import { render, screen } from '@testing-library/react'
import { ResultsTable } from './ResultsTable'
import { useQuery } from '@tanstack/react-query'
import { Mock } from 'vitest'

const gooRate = 0.0175123 // mad to kzt
const binSellPrice = 550 // kzt
const binBuyPrice = 9.45 // mad
const binRate = binBuyPrice / binSellPrice // mad to kzt
const absDiff = binRate - gooRate // mad to kzt
const relDiff = (absDiff / binRate)
const totalDiff = 5000 * relDiff

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({ data: { rate: gooRate } }))
}))

vi.mock('@/store/adverts', () => ({
  useAdvertsStore: vi.fn(() => ({
    selectedSellAdv: {
      adv: {
        price: binSellPrice,
      },
    },
    selectedBuyAdv: {
      adv: {
        price: binBuyPrice,
      },
    },
  })),
}))

describe('ResultsTable', () => {
  test('Renders the table', async () => {
    render(<ResultsTable />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    const cells = screen.getAllByRole('cell')
    expect(cells).toHaveLength(5)
  })

  describe('Loss case', () => {
    test('Displays google mad to kzt rate', () => {
      render(<ResultsTable />)
      const cells = screen.getAllByRole('cell')
      expect(cells.at(1)).toHaveTextContent(gooRate.toFixed(4))
    })

    test('Calculates binance mad to kzt rate', () => {
      render(<ResultsTable />)
      const cells = screen.getAllByRole('cell')
      expect(cells.at(0)).toHaveTextContent(binRate.toFixed(4))
    })

    test('Calculates absolute rate difference', () => {
      render(<ResultsTable />)
      const cells = screen.getAllByRole('cell')
      expect(cells.at(2)).toHaveTextContent(absDiff.toFixed(3))
      expect(cells.at(2)).toHaveTextContent('-')
    })

    test('Calculates relative rate difference', () => {
      render(<ResultsTable />)
      const cells = screen.getAllByRole('cell')
      expect(cells.at(3)).toHaveTextContent((relDiff * 100).toFixed(3) + '%')
      expect(cells.at(3)).toHaveTextContent('-')
    })

    test('Calculates relative rate difference', () => {
      render(<ResultsTable />)
      const cells = screen.getAllByRole('cell')
      expect(cells.at(4)).toHaveTextContent(totalDiff.toFixed(2))
      expect(cells.at(4)).toHaveTextContent('-')
    })

    test('Renders resulting cells red', () => {
      render(<ResultsTable />)
      const cells = screen.getAllByRole('cell')
      expect(cells.at(3)).toHaveClass('bg-red-300')
      expect(cells.at(4)).toHaveClass('bg-red-300')
    })
  })

  describe('Gain case', () => {
    const gooRate = 0.0166;
    const binRate = binBuyPrice / binSellPrice // mad to kzt
    const absDiff = binRate - gooRate // mad to kzt
    const relDiff = (absDiff / binRate)
    const totalDiff = 5000 * relDiff
    beforeEach(() => {
      (useQuery as Mock).mockImplementation(() => ({ data: { rate: gooRate } }))
    })

    test('Displays google mad to kzt rate', () => {
      render(<ResultsTable />)
      const cells = screen.getAllByRole('cell')
      expect(cells.at(1)).toHaveTextContent(gooRate.toFixed(4))
    })

    test('Calculates binance mad to kzt rate', () => {
      render(<ResultsTable />)
      const cells = screen.getAllByRole('cell')
      expect(cells.at(0)).toHaveTextContent(binRate.toFixed(4))
    })

    test('Calculates absolute rate difference', () => {
      render(<ResultsTable />)
      const cells = screen.getAllByRole('cell')
      expect(cells.at(2)).toHaveTextContent(absDiff.toFixed(3))
      expect(cells.at(2)).not.toHaveTextContent('-')
    })

    test('Calculates relative rate difference', () => {
      render(<ResultsTable />)
      const cells = screen.getAllByRole('cell')
      expect(cells.at(3)).toHaveTextContent((relDiff * 100).toFixed(3) + '%')
      expect(cells.at(3)).not.toHaveTextContent('-')
    })

    test('Calculates relative rate difference', () => {
      render(<ResultsTable />)
      const cells = screen.getAllByRole('cell')
      expect(cells.at(4)).toHaveTextContent(totalDiff.toFixed(2))
      expect(cells.at(4)).not.toHaveTextContent('-')
    })

    test('Renders resulting cells green', () => {
      render(<ResultsTable />)
      const cells = screen.getAllByRole('cell')
      expect(cells.at(3)).toHaveClass('bg-green-300')
      expect(cells.at(4)).toHaveClass('bg-green-300')
    })
  })
})
