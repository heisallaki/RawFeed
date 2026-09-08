"""add is_admin to users

Revision ID: 4be05350e4b2
Revises: a1f29f0bdd40
Create Date: 2026-09-08 11:31:33.198753
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '4be05350e4b2'
down_revision: Union[str, None] = 'a1f29f0bdd40'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'users',
        sa.Column(
            'is_admin',
            sa.Boolean(),
            nullable=False,
            server_default=sa.false()
        )
    )


def downgrade() -> None:
    op.drop_column('users', 'is_admin')