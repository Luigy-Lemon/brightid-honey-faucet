import { utils as EthersUtils } from 'ethers'

export function bigNum(value) {
  return new EthersUtils.BigNumber(value)
}

export function formatTokenAmount(
  amount,
  decimals = 0,
  displaySign = false,
  isIncoming
) {
  return (
    (displaySign ? (isIncoming ? '+' : '-') : '') +
    formatUnits(amount, { digits: decimals })
  )
}

/**
 * Format a decimal-based number back to a normal number
 *
 * @param {string} value the number
 * @param {number} digits number of decimal places
 * @returns {BN} value converted to it's normal representation
 */
export function parseUnits(value, digits) {
  return EthersUtils.parseUnits(value, digits)
}

/**
 * Format an amount of units to be displayed.
 *
 * @param {BigNumber} value Amount of units to format.
 * @param {Number} options.digits Amount of digits on the token.
 * @param {Boolean} options.commas Use comma-separated groups.
 * @param {Boolean} options.replaceZeroBy The string to be returned when value is zero.
 * @param {Boolean} options.precision The precision of the resulting number
 * @returns {String} value formatted
 */
export function formatUnits(
  value,
  { digits = 18, commas = true, replaceZeroBy = '0', precision = 2 } = {}
) {
  if (value.lt(0) || digits < 0) {
    return ''
  }

  let valueBeforeCommas = EthersUtils.formatUnits(value.toString(), digits)

  // Replace 0 by an empty value
  if (valueBeforeCommas === '0.0') {
    return replaceZeroBy
  }

  // EthersUtils.formatUnits() adds a decimal even when 0, this removes it.
  valueBeforeCommas = valueBeforeCommas.replace(/\.0$/, '')

  const roundedValue = round(valueBeforeCommas, precision)

  return commas ? EthersUtils.commify(roundedValue) : roundedValue
}

/**
 * Format an amount of units to be displayed.
 *
 * @param {String} value Value to round
 * @param {Number} precision Rounding precision
 * @returns {String} Value rounded to `precision` decimals
 */
export function round(value, precision = 2) {
  let [whole, decimal] = value.split('.')

  if (!decimal || decimal.length <= precision) return value

  // Round and keep the last `precision` digits
  decimal = Math.round(parseInt((decimal || '0').slice(0, precision + 2)) / 100)

  return `${whole}${decimal ? `.${decimal}` : ''}`
}

export function getPercentage(value, totalValue) {
  if (!totalValue > 0) return 0

  return Math.round((value * 100) / totalValue, 2)
}

// Return 0 if denominator is 0 to avoid NaNs
export function safeDiv(num, denom) {
  return denom ? num / denom : 0
}
