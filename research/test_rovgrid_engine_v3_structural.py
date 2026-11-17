"""Standard-library tests for the mathematical claims of ROVGRID v3."""
import unittest
from decimal import Decimal
from fractions import Fraction
from rovgrid_engine_v3_structural import (
    fibonacci_triplet_safe, cassini_signed, fibonacci_golden_pair,
    fibonacci_arctan_tail_bound, pi_fibonacci,
    e_interval,euler_pair,e_continued_fraction,e_terms_for_digits,
    pi_chudnovsky,pi_heegner67,pi_67_wrong_variant
)

class StructuralAudit(unittest.TestCase):
    def test_cassini_and_poor_fault_detection(self):
        for k in range(2,50):
            self.assertEqual(cassini_signed(k),(-1)**(k-1))
        # Single-bit register flip, F(1)=1 ->0 at grade 3, absolute residual unchanged!
        self.assertEqual(abs(2*1-1**2),1)
        self.assertEqual(abs(2*0-1**2),1)
        self.assertEqual(fibonacci_triplet_safe(47),(2971215073,1836311903,1134903170))

    def test_fibonacci_phi_and_sqrt5_pair(self):
        phi,root5=fibonacci_golden_pair(47)
        self.assertEqual(phi,Fraction(2971215073,1836311903))
        self.assertEqual(root5,Fraction(4106118243,1836311903))
        self.assertEqual(fibonacci_triplet_safe(24),(46368,28657,17711))
        self.assertEqual(fibonacci_arctan_tail_bound(23),Fraction(4,4807526976))
        self.assertEqual(fibonacci_arctan_tail_bound(38),Fraction(4,8944394323791464))

    def test_exact_arctan_telescoping(self):
        x=pi_fibonacci(1,90)
        for m in (2,3,12):
            self.assertLess(abs(x-pi_fibonacci(m,90)),Decimal('1e-86'))

    def test_euler_convergents(self):
        expected=['3/1','8/3','11/4','19/7','87/32','106/39','193/71']
        for k,s in enumerate(expected,1):
            self.assertEqual(e_continued_fraction(k),Fraction(s))
        self.assertEqual(e_interval(0,4,False),(16,6)) # 1+1+1/2+1/6 = 16/6
        self.assertEqual(e_interval(0,4,True),(2,6))  # 1−1+1/2−1/6 = 2/6

    def test_euler_500_digit_threshold(self):
        self.assertFalse(euler_pair(500,220).within_tolerance)
        good=euler_pair(500,260)
        self.assertTrue(good.within_tolerance)
        self.assertLess(good.residual,Decimal('1e-500'))
        self.assertGreaterEqual(e_terms_for_digits(500),260)

    def test_real_67_against_chud_163(self):
        p=pi_heegner67(120)
        c=pi_chudnovsky(120)
        f=pi_fibonacci(1,120)
        self.assertLess(abs(p-c),Decimal('1e-115'))
        self.assertLess(abs(f-c),Decimal('1e-114'))
        bad=pi_67_wrong_variant(60)
        self.assertGreater(abs(Decimal(1)/bad - c),Decimal(1))
        self.assertEqual(33*16,528)

    def test_term_count_claims(self):
        ref=pi_chudnovsky(530,40)
        self.assertGreater(abs(pi_heegner67(530,50)-ref),Decimal('1e-420'))
        self.assertLess(abs(pi_heegner67(530,65)-ref),Decimal('1e-510'))

if __name__=='__main__':
    unittest.main(verbosity=2)