def test_email_service_exports_all_required_functions():
    from app.services import email_service

    assert hasattr(email_service, "send_email")
    assert hasattr(email_service, "send_verification_email")
    assert hasattr(email_service, "send_password_reset_email")
    assert hasattr(email_service, "send_account_deletion_email")