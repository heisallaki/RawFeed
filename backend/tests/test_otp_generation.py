from app.services.otp import generate_code


def test_generate_code_is_six_digits():
    code = generate_code()
    assert len(code) == 6
    assert code.isdigit()


def test_generate_code_varies_across_calls():
    codes = {generate_code() for _ in range(20)}
    assert len(codes) > 1