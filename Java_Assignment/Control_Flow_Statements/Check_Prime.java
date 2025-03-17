import java.util.Scanner;

public class Check_Prime {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Enter a number: ");
        int num = sc.nextInt();
        boolean is_prime = num > 1;

        for (int i = 2; i * i <= num; i++) {
            if (num % i == 0) {
                is_prime = false;
                break;
            }
        }

        if (is_prime) {
            System.out.println("Number is a prime number");
        } else {
            System.out.println("Number is not a prime number");
        }

        sc.close();
    }
}
