/*export const daysLeft = (deadline) => {
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingDays = difference / (1000 * 3600 * 24);
  
    return remainingDays.toFixed(0);
  };
  */

  export const daysLeft = (deadline) => {
    const timestamp = Number(deadline); // Ensure it's a number
    if (isNaN(timestamp)) return "Invalid date"; // Handle invalid input

    const deadlineDate = new Date(timestamp * 1000); // Convert to milliseconds
    const difference = deadlineDate.getTime() - Date.now();
    const remainingDays = difference / (1000 * 3600 * 24);

    return remainingDays >= 0 ? remainingDays.toFixed(0) : "0"; // Ensure no negative days
};


/**
 
Understanding the daysLeft Function

export const daysLeft = (deadline) => {
This is an exported function that calculates how many days are left until the deadline.

It takes deadline as an argument, which represents the campaign's deadline (Unix timestamp).

1️⃣ Convert deadline to a Number

const timestamp = Number(deadline);
Why? deadline might be a string (as seen in your console logs: Type of Deadline: string).

What does it do? Number(deadline) ensures it's treated as a valid numeric timestamp.

If deadline was "1743379200", it now becomes 1743379200 (a proper number).

2️⃣ Handle Invalid Inputs

if (isNaN(timestamp)) return "Invalid date"; 
Why? If deadline is not a valid number (NaN), returning "Invalid date" prevents errors.

Example: If deadline = "abcd", Number(deadline) would result in NaN.

3️⃣ Convert Unix Timestamp to JavaScript Date

const deadlineDate = new Date(timestamp * 1000);
Why multiply by 1000?

Blockchain timestamps are usually in seconds (e.g., 1743379200 for a future deadline).

JavaScript’s Date object works with milliseconds, so we multiply by 1000 to match formats.

Example:


new Date(1743379200000); // Correct conversion to Date object
Now, deadlineDate is a valid JavaScript Date.

4️⃣ Calculate Remaining Time

const difference = deadlineDate.getTime() - Date.now();
deadlineDate.getTime() returns the milliseconds for the deadline.

Date.now() gives the current time in milliseconds.

Subtracting the two gives the remaining time in milliseconds.

5️⃣ Convert Milliseconds to Days

const remainingDays = difference / (1000 * 3600 * 24);
Why divide by 1000 * 3600 * 24?

1000 (milliseconds → seconds)

3600 (seconds → hours)

24 (hours → days)

This converts milliseconds into full days.

6️⃣ Return the Final Value

return remainingDays >= 0 ? remainingDays.toFixed(0) : "0";
.toFixed(0) → Rounds down to the nearest whole number (e.g., 4.8 → "4").

If remainingDays is negative, return "0" to prevent showing -1 or -2 days.

🔹 Example Walkthrough
Let's say today's timestamp is 1711113600000 (March 22, 2025).
Your campaign deadline is June 30, 2025 (1743379200 in seconds).




Step-by-Step Calculation
Convert deadline to JavaScript Date:

const deadlineDate = new Date(1743379200 * 1000);
// Equivalent to new Date(1743379200000);
→ Date Object: Mon, 30 Jun 2025 00:00:00 GMT

Calculate the difference in milliseconds:

const difference = 1743379200000 - 1711113600000; 
// 32265600000 milliseconds


Convert to days:

const remainingDays = 32265600000 / (1000 * 3600 * 24);
// 373.5 days
Round down to nearest whole number:


return remainingDays.toFixed(0); // "373"
→ Output: "373" days left.

🚀 Key Takeaways
✅ Blockchain timestamps are in seconds; JavaScript Date expects milliseconds.
✅ Convert Unix timestamps properly (* 1000).
✅ Ensure deadline is a number to avoid NaN errors.
✅ Prevent negative days by returning "0" if remainingDays < 0.

Let me know if you need any more clarifications! 🔥

 */