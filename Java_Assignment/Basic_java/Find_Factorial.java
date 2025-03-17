import java.util.Scanner;

public class Find_Factorial {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the number to find it's factorial : ");
        long number = sc.nextLong();
        long factorial = find_factorial(number);
        System.out.println("The factorial of the number is : " + factorial);
        sc.close();
    }
    public static long find_factorial (long number) {
        if (number == 0 || number == 1) {
            return number;
        }
        return number * find_factorial(number-1);
    }
}
