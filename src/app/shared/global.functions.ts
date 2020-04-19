import { ValidatorFn, FormGroup, ValidationErrors } from "@angular/forms";

/** A hero's name can't match the given regular expression */
export const checkDateDifference: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const startPicker = control.get("startPicker");
  const endPicker = control.get("endPicker");
  return startPicker && endPicker && compareDate(new Date(endPicker.value), new Date(startPicker.value)) > 0 
  && compareDate(new Date(), new Date(endPicker.value)) >= 0
    ? null
    : { invalidDateRange: true };
};

/** 
 * Compares two Date objects and returns e number value that represents 
 * the result:
 * 0 if the two dates are equal.
 * 1 if the first date is greater than second.
 * -1 if the first date is less than second.
 * @param date1 First date object to compare.
 * @param date2 Second date object to compare.
 */
export function compareDate(date1: Date, date2: Date): number
{
  // With Date object we can compare dates them using the >, <, <= or >=.
  // The ==, !=, ===, and !== operators require to use date.getTime(),
  // so we need to create a new instance of Date with 'new Date()'
  let d1 = new Date(date1); let d2 = new Date(date2);

  // Check if the dates are equal
  let same = d1.getTime() === d2.getTime();
  if (same) return 0;

  // Check if the first is greater than second
  if (d1 > d2) return 1;
 
  // Check if the first is less than second
  if (d1 < d2) return -1;
}