import java.util.HashMap;
import java.util.Scanner;

public class Check_Anagram {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        HashMap<Character, Integer> map = new HashMap<>();
        System.out.print("Enter String 1 : ");
        String s1 = sc.next();
        System.out.print("Enter String 2 : ");
        String s2 = sc.next();
        for (char ch : s1.toCharArray()) 
            map.put(ch, map.getOrDefault(ch, 0) + 1);
  
        for (char ch : s2.toCharArray()) 
            map.put(ch, map.getOrDefault(ch, 0) - 1);
  
        boolean is_Anagram = true;
        for (var pair : map.entrySet()) {
            if (pair.getValue() != 0) {
                is_Anagram = false;
            }
        }
        
        System.out.println(is_Anagram ? "Strings are Anagram" : "String are not Anagram");
        sc.close();
    }
}
