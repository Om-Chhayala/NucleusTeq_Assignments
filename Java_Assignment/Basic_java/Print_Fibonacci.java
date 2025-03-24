import java.util.Scanner;

public class Print_Fibonacci {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the number you want to print the Fibonacci sequence up to : ");
        int number = sc.nextInt();
        System.out.print("0 1 ");  // default series
        int last_term = 1;
        int second_last_term = 0;
        while (true) {
            int new_term = last_term + second_last_term;
            if (new_term > number) break;
            System.out.print(new_term + " ");
            second_last_term = last_term;
            last_term = new_term;
        }
        sc.close();
    }
}