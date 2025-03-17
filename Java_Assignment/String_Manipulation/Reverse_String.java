import java.util.Scanner;

public class Reverse_String {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the String : ");
        String s = sc.next();
        String res = "";
        for (int i = s.length()-1; i >= 0; i--) {
            res += s.charAt(i);
        }
        System.out.println("Reversed String is : " + res);
        sc.close();
    }
}
