import java.util.Scanner;

public class Operators {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter two numbers: ");
        int a = sc.nextInt(), b = sc.nextInt();

        System.out.println("\nArithmetic Operators:");
        System.out.println("Addition: " + (a + b));
        System.out.println("Subtraction: " + (a - b));
        System.out.println("Multiplication: " + (a * b));
        System.out.println("Division: " + (a / b));
        System.out.println("Modulus: " + (a % b));

        System.out.println("\nRelational Operators:");

        if (a == b) {
            System.out.println("a is equal to b");
        } else {
            System.out.println("a is not equal to b");
        }

        if (a != b) {
            System.out.println("a is not equal to b");
        } else {
            System.out.println("a is equal to b");
        }

        if (a > b) {
            System.out.println("a is greater than b");
        } else {
            System.out.println("a is not greater than b");
        }

        if (a < b) {
            System.out.println("a is less than b");
        } else {
            System.out.println("a is not less than b");
        }

        if (a >= b) {
            System.out.println("a is greater than or equal to b");
        } else {
            System.out.println("a is not greater than or equal to b");
        }

        if (a <= b) {
            System.out.println("a is less than or equal to b");
        } else {
            System.out.println("a is not less than or equal to b");
        }

        System.out.print("\nEnter two boolean values (true/false): ");
        boolean x = sc.nextBoolean(), y = sc.nextBoolean();

        System.out.println("\nLogical Operators:");

        if (x && y) {
            System.out.println("x && y is true");
        } else {
            System.out.println("x && y is false");
        }

        if (x || y) {
            System.out.println("x || y is true");
        } else {
            System.out.println("x || y is false");
        }

        if (!x) {
            System.out.println("!x is true");
        } else {
            System.out.println("!x is false");
        }

        sc.close();
    }
}
