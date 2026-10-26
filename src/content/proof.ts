export interface ProofData {
  logos: { name: string; logoUrl: string }[]
  testimonials: {
    quote: string
    author: string
    role: string
    company: string
  }[]
  stats: {
    value: number
    prefix?: string
    suffix?: string
    label: string
  }[]
}

// Ships strictly empty as required by the client specification.
// Blocks only render if non-empty data is provided by the client.
export const PROOF_DATA: ProofData = {
  logos: [],
  testimonials: [],
  stats: [],
}
