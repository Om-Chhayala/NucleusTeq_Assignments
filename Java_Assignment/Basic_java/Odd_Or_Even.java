import java.util.Scanner;

public class Odd_Or_Even {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the number that you want to check weather it is even or odd : ");
        int number = sc.nextInt();
        if ((number & 1) == 1) {
            System.out.println("The number you entered is odd");
        } else {
            System.out.println("The number you entered is even");
        }
        sc.close();
    }
}
