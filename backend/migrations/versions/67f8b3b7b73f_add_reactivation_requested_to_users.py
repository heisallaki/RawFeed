"""add reactivation_requested to users

Revision ID: 67f8b3b7b73f
Revises: 4be05350e4b2
Create Date: 2026-09-08 12:17:59.089659
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '67f8b3b7b73f'
down_revision: Union[str, None] = '4be05350e4b2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'users',
        sa.Column(
            'reactivation_requested',
            sa.Boolean(),
            nullable=False,
            server_default=sa.false()
        )
    )

def downgrade() -> None:
    op.drop_column('users', 'reactivation_requested')