public class Exception_Handling {
    public static void main(String[] args) {
        try {
            int[] myNumbers = { 1, 2, 3 };
            System.out.println(myNumbers[10]);
        } catch (Exception e) {
            System.out.println("Something went wrong in try-catch block 1 " + e);
        }
        try {
            int ans = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Something went wrong in try-catch block 2 " + e);
        }
    }

}
