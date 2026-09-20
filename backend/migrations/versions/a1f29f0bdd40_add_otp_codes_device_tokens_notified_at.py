"""add otp codes, device tokens, notified_at

Revision ID: a1f29f0bdd40
Revises: 0bd8b55d1665
Create Date: 2026-09-07 11:27:38.230326
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'a1f29f0bdd40'
down_revision: Union[str, None] = '0bd8b55d1665'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('device_tokens',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('user_id', sa.UUID(), nullable=False),
    sa.Column('expo_push_token', sa.String(length=255), nullable=False),
    sa.Column('platform', sa.String(length=16), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('expo_push_token')
    )
    op.create_table('otp_codes',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('user_id', sa.UUID(), nullable=False),
    sa.Column('purpose', sa.String(length=32), nullable=False),
    sa.Column('code_hash', sa.String(length=255), nullable=False),
    sa.Column('attempts', sa.Integer(), nullable=False),
    sa.Column('max_attempts', sa.Integer(), nullable=False),
    sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('consumed_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('events', sa.Column('notified_at', sa.DateTime(timezone=True), nullable=True))

def downgrade() -> None:
    op.drop_column('events', 'notified_at')
    op.drop_table('otp_codes')
    op.drop_table('device_tokens')